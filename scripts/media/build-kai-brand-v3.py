#!/usr/bin/env python3
"""Build approved Kai v3 sources into website variants. Pillow only, no AI calls.
Keeps prior public originals, never enlarges source pixels, and records every hash.
Run after both generation manifests are complete. --hero-only builds the new hero.
"""
from pathlib import Path
from PIL import Image, ImageOps
import argparse, hashlib, json, shutil

ROOT = Path(__file__).resolve().parents[2]
PUB, SRC, DOC = ROOT/'public', ROOT/'assets-source/kai-brand-v3', ROOT/'docs'
parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument('--hero-only', action='store_true')
parser.add_argument('--batch-only', action='store_true', help='Build the 20 approved calendar/service scenes while legacy editing continues')
args = parser.parse_args()
assets = []

def sha(path): return hashlib.sha256(path.read_bytes()).hexdigest()
def details(path):
    with Image.open(path) as image:
        image.load()
        return {'path': str(path.relative_to(ROOT)), 'width': image.width, 'height': image.height, 'bytes': path.stat().st_size, 'sha256': sha(path), 'format': image.format}
def preserve(path):
    if path.exists():
        previous = SRC/'previous-public'/path.relative_to(PUB)
        if not previous.exists():
            previous.parent.mkdir(parents=True, exist_ok=True)
            shutil.copyfile(path, previous)
def save(image, path, quality=83, backup=False):
    if backup: preserve(path)
    path.parent.mkdir(parents=True, exist_ok=True)
    temporary=path.with_name('.'+path.name+'.v3-tmp')
    if path.suffix == '.jpg': image.convert('RGB').save(temporary, 'JPEG', quality=91, optimize=True)
    elif path.suffix == '.png': image.save(temporary, 'PNG', optimize=True)
    else: image.save(temporary, 'WEBP', quality=quality, method=6, exact=True)
    temporary.replace(path)
    return details(path)
def normalise(image):
    if 'A' in image.getbands() or 'transparency' in image.info:
        image=image.convert('RGBA')
        if image.getextrema()[-1][0] < 255: return image
    return image.convert('RGB')
def resized(image, width):
    width = min(width, image.width)
    return image.resize((width, round(image.height*width/image.width)), Image.Resampling.LANCZOS)
def fit(image, size, focal=(.6,.5)):
    scale = min(1, image.width/size[0], image.height/size[1])
    actual = (max(1, round(size[0]*scale)), max(1, round(size[1]*scale)))
    return ImageOps.fit(image, actual, Image.Resampling.LANCZOS, centering=focal)
def square(image, size, center=.6):
    side=min(image.width,image.height)
    left=max(0,min(image.width-side,round(image.width*center-side/2)))
    top=max(0,round((image.height-side)/2))
    return image.crop((left,top,left+side,top+side)).resize((min(size,side),min(size,side)), Image.Resampling.LANCZOS)
def record(kind, identity, source, variants, **extra):
    assets.append({'kind':kind,'id':identity,'source':details(source),'variants':variants,**extra})

master=SRC/'hero-cleaning.png'
with Image.open(master) as image:
    image=normalise(image)
    record('hero','cleaning',master,[save(resized(image,w),PUB/f'kai-brand-v3/hero-cleaning-{w}.webp',84) for w in [1672,960]])
    if not args.hero_only:
        record('fallback','home',master,[save(resized(image,1440),PUB/'imagen-google-ai-compatible-desktop.webp',84,True)])
        record('social','og',master,[save(fit(image,(1200,630)),PUB/'kraken-og-1200x630.jpg',backup=True)])

if not args.hero_only:
    batch=json.loads((DOC/'KAI_BRAND_BATCH_GENERATION.json').read_text())['assets']
    legacy=json.loads((DOC/'KAI_BRAND_LEGACY_GENERATION.json').read_text())['assets']
    assert len(batch)==20 and all(a['status']=='generated' and (SRC/a['kind']/(a['id']+'.png')).exists() for a in batch),'Finish all 20 calendar/service sources first'
    if not args.batch_only:
        assert len(legacy)==28 and all(a['status']=='copied' and (SRC/'legacy'/(a['slug']+'.png')).exists() for a in legacy),'Finish all 28 legacy sources first'
    focal={'spring':.72,'summer':.60,'autumn':.60,'winter':.63,'new-year':.65,'carnival':.60,'easter':.60,'sechselaeuten':.60,'swiss-national-day':.60,'back-to-school':.60,'harvest':.60,'samichlaus':.65,'christmas':.60,'new-years-eve':.60,'spring-cleaning':.65}
    for item in batch:
        identity=item['id']; source=SRC/item['kind']/(identity+'.png'); point=tuple(item.get('recommendedFocalPoint', [focal.get(identity,.55),.5]))
        if item['kind']=='service': source=SRC/'services'/(identity+'.png')
        variants=[]
        with Image.open(source) as image:
            image=normalise(image)
            if item['kind']=='calendar':
                for width in [1440,768]: variants.append(save(resized(image,width),PUB/f'kai-calendar/{identity}/hero-{width}.webp'))
                variants.append(save(fit(image,(768,576),point),PUB/f'kai-calendar/{identity}/mobile-768.webp'))
                variants.append(save(square(image,320,point[0]),PUB/f'kai-calendar/{identity}/avatar-320.webp',85))
            else:
                for width in [1440,768,480]:
                    filename=identity+('' if width==768 else '-'+str(width))+'.webp'
                    variants.append(save(fit(image,(width,round(width*2/3)),point),PUB/'kai-services'/filename))
        record(item['kind'],identity,source,variants)
    if args.batch_only:
        (DOC/'KAI_BRAND_V3_BATCH_ASSETS.json').write_text(json.dumps({'partial':True,'assets':assets},indent=2)+'\n')
        print('Calendar and service variants built; full manifest awaits legacy sources')
        raise SystemExit(0)
    commercial={'servicio-comercial-limpieza-escaleras':'property-managers','servicio-comercial-limpieza-showroom':'offices-corporate','servicio-comercial-limpieza-retail':'retail-showrooms','servicio-comercial-limpieza-bar-restaurante':'gastronomy-restaurants','servicio-comercial-limpieza-industrial':'industry-logistics','imagen-02-google-ai':'airbnb-rentals'}
    for item in legacy:
        identity=item['slug']; source=SRC/'legacy'/(identity+'.png'); previous=ROOT/('public/'+item['source_path'].split('/public/',1)[1] if '/public/' in item['source_path'] else 'assets-source/'+item['source_path'].split('/assets-source/',1)[1]); variants=[]
        with Image.open(source) as image:
            image=normalise(image)
            if previous.is_relative_to(PUB): variants.append(save(resized(image,min(image.width,1672)),previous,86,True))
            if identity.startswith('servicio-privado-'):
                with Image.open(SRC/'previous-public'/previous.relative_to(PUB)) as old: ratio=old.height/old.width
                variants.append(save(fit(image,(768,round(768*ratio)),(.60,.5)),PUB/'kai-calendar/optimized/private'/(identity+'.webp')))
            elif identity in commercial:
                for width in [1440,768,480]: variants.append(save(resized(image,width),PUB/f'kai-calendar/optimized/commercial/{commercial[identity]}/{width}.webp'))
            elif identity in ['kai-zurich','kai-winterthur','kai-schaffhausen','kai-reviews']:
                for width in [160,320]: variants.append(save(square(image,width,.55),PUB/f'kai-calendar/optimized/kai/{identity}-{width}.webp',85))
            elif identity in ['about-consultancy','about-team']:
                for width in [1200,768]: variants.append(save(resized(image,width),PUB/f'kai-calendar/optimized/about/{identity.removeprefix("about-")}-{width}.webp'))
        record('legacy',identity,source,variants)
    pose=SRC/'kai-pose-transparent.png'
    assert pose.exists(),'Generate approved transparent pose first'
    with Image.open(pose) as image:
        assert image.mode=='RGBA' and image.getextrema()[-1][0]==0,'Pose must contain real alpha transparency'
        variants=[]
        for width in [200,800]: variants.append(save(resized(image,width),PUB/f'mascota-kraken-homepage-{width}.webp',88,True))
        variants.append(save(resized(image,800),PUB/'mascota-kraken-homepage.webp',88,True))
        for width in [160,320]: variants.append(save(resized(image,width),PUB/f'kai-calendar/optimized/kai/mascota-kraken-homepage-{width}.webp',88))
        record('mascot','pose',pose,variants)
    manifest={'schemaVersion':1,'date':'2026-11-21','provider':'built-in image_gen','video':'User selected provisional CSS/parallax animation; no video job or asset created','nativeSources':len({a['source']['path'] for a in assets}),'publicVariants':sum(len(a['variants']) for a in assets),'assets':assets}
    (DOC/'KAI_BRAND_V3_ASSETS.json').write_text(json.dumps(manifest,indent=2)+'\n')
    print('Sources:',manifest['nativeSources'],'public variants:',manifest['publicVariants'],'public bytes:',sum(v['bytes'] for a in assets for v in a['variants']))
else: print('Hero variants built')
