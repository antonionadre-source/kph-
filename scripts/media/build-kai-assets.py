#!/usr/bin/env python3
"""Build efficient WebP assets from approved generated sources and valid originals.
Requires Pillow. Never calls an image provider, replaces originals, or repairs missing images.
"""
from pathlib import Path
from PIL import Image, ImageOps
import argparse, hashlib, json, shutil, unicodedata, re

ROOT = Path(__file__).resolve().parents[2]
PUB = ROOT / 'public'
DOC = ROOT / 'docs'
parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument('--calendar-only', action='store_true')
parser.add_argument('--existing-only', action='store_true')
parser.add_argument('--services-only', action='store_true')
args = parser.parse_args()
if (DOC/'KAI_BRAND_V3_ASSETS.json').exists():
    raise SystemExit('Kai v3 is current. Rebuild with scripts/media/build-kai-brand-v3.py; this earlier pipeline is historical.')

def sha(path): return hashlib.sha256(path.read_bytes()).hexdigest()
def info(path, url=None):
    with Image.open(path) as image:
        image.load()
        with Image.open(path) as verify: verify.verify()
        return dict(src=url or '/' + str(path.relative_to(PUB)), width=image.width, height=image.height, bytes=path.stat().st_size, format=image.format, sha256=sha(path))
def webp(image, target, quality=79):
    target.parent.mkdir(parents=True, exist_ok=True)
    image.save(target, format='WEBP', quality=quality, method=6, exact=True)
    return info(target)
def crop_at(image, size, focal=(.60,.50)):
    return ImageOps.fit(image, size, method=Image.Resampling.LANCZOS, centering=focal)
def resize_width(image, width):
    width=min(width,image.width)
    return image.resize((width, round(image.height*width/image.width)), Image.Resampling.LANCZOS)

if not args.existing_only and not args.services_only:
    generation=json.loads((DOC/'KAI_MEDIA_GENERATION.json').read_text())
    catalog=[]
    for item in generation['assets']:
        asset_id=item['id']; generated=Path(item['sourcePath'])
        original=ROOT/'assets-source'/'kai-calendar'/(asset_id+'.png')
        original.parent.mkdir(parents=True, exist_ok=True)
        if original.exists():
            if generated.exists() and sha(original)!=sha(generated): raise RuntimeError('Refusing to overwrite selected source '+str(original))
        else: shutil.copyfile(generated, original)
        with Image.open(original) as image:
            image.load(); image=image.convert('RGB')
            focal=(.70,.50) if asset_id=='spring' else (.60,.50)
            directory=PUB/'kai-calendar'/asset_id
            variants={}
            for name,size,quality in [('hero-1440',(1440,960),80),('hero-768',(768,512),78),('mobile-768',(768,576),78)]:
                variants[name]=webp(crop_at(image,size,focal),directory/(name+'.webp'),quality)
            # Face and cap, not a shrunken full-width banner.
            side=round(image.height*.55);cx=round(image.width*focal[0]);cy=round(image.height*.31)
            left=max(0,min(image.width-side,cx-side//2));top=max(0,min(image.height-side,cy-side//2))
            avatar=image.crop((left,top,left+side,top+side)).resize((320,320),Image.Resampling.LANCZOS)
            variants['avatar-320']=webp(avatar,directory/'avatar-320.webp',82)
        catalog.append(dict(id=asset_id,kind='new-ai-generated-illustration',provider='built-in image_gen',sourceOriginal=str(original.relative_to(ROOT)),originalBytes=original.stat().st_size,originalSha256=sha(original),focalPoint=list(focal),variants=variants))
    (DOC/'KAI_MEDIA_CATALOG.json').write_text(json.dumps({'schemaVersion':1,'date':'2026-11-21','assets':catalog},indent=2)+'\n')
    print('Calendar scenes:',len(catalog),'public bytes:',sum(v['bytes'] for a in catalog for v in a['variants'].values()))

if not args.calendar_only and not args.services_only:
    optimized=[]
    commercial={
        'property-managers':'servicio-comercial-limpieza-escaleras.png',
        'offices-corporate':'servicio-comercial-limpieza-showroom.png',
        'retail-showrooms':'servicio-comercial-limpieza-retail.png',
        'gastronomy-restaurants':'servicio-comercial-limpieza-bar-restaurante.png',
        'industry-logistics':'servicio-comercial-limpieza-industrial.png',
        'airbnb-rentals':'imagen-02-google-ai.webp',
    }
    for asset_id,name in commercial.items():
        source=PUB/name;before=sha(source)
        with Image.open(source) as image:
            image.load();image=image.convert('RGB');variants={}
            for width,quality in [(1440,79),(768,77),(480,76)]:
                variants[str(width)]=webp(resize_width(image,width),PUB/'kai-calendar'/'optimized'/'commercial'/asset_id/(str(width)+'.webp'),quality)
        assert before==sha(source)
        optimized.append(dict(kind='existing-commercial-original',id=asset_id,source='/'+name,sourceBytes=source.stat().st_size,sourceSha256=before,variants=variants))
    for source in sorted(PUB.glob('*.webp')):
        if not (source.name.lower().startswith('kai') or source.name.lower().startswith('mascota-kraken-homepage')):continue
        try:
            with Image.open(source) as image:
                image.load();before=sha(source)
                slug=re.sub(r'[^a-z0-9]+','-',unicodedata.normalize('NFKD',source.stem).encode('ascii','ignore').decode().lower()).strip('-')
                variants={}
                for size in [160,320]:
                    resized=image.copy();resized.thumbnail((size,size),Image.Resampling.LANCZOS)
                    variants[str(size)]=webp(resized,PUB/'kai-calendar'/'optimized'/'kai'/(slug+'-'+str(size)+'.webp'),80)
            assert before==sha(source)
            optimized.append(dict(kind='existing-kai-original',id=slug,source='/'+source.name,sourceBytes=source.stat().st_size,sourceSha256=before,variants=variants))
        except (OSError,ValueError):
            # Broken originals are documented elsewhere and never replaced by this task.
            continue
    (DOC/'KAI_MEDIA_OPTIMIZED.json').write_text(json.dumps({'schemaVersion':1,'date':'2026-11-21','assets':optimized},indent=2)+'\n')
    print('Optimized original assets:',len(optimized),'public bytes:',sum(v['bytes'] for a in optimized for v in a['variants'].values()))

if not args.existing_only and not args.calendar_only:
    service_manifest=DOC/'KAI_MEDIA_SERVICES_GENERATION.json'
    if service_manifest.exists():
        service_catalog=[]
        for item in json.loads(service_manifest.read_text())['assets']:
            asset_id=item['id'];generated=Path(item['sourcePath'])
            original=ROOT/'assets-source'/'kai-services'/(asset_id+'.png')
            original.parent.mkdir(parents=True,exist_ok=True)
            if original.exists():
                if generated.exists() and sha(original)!=sha(generated):raise RuntimeError('Refusing source overwrite '+str(original))
            else:shutil.copyfile(generated,original)
            with Image.open(original) as image:
                image.load();image=image.convert('RGB');variants={}
                for width,quality in [(1440,80),(768,78),(480,77)]:
                    name=asset_id+'.webp' if width==768 else asset_id+'-'+str(width)+'.webp'
                    variants[str(width)]=webp(crop_at(image,(width,round(width*2/3)),(.60,.50)),PUB/'kai-services'/name,quality)
            service_catalog.append(dict(id=asset_id,kind='new-ai-generated-service-illustration',provider='built-in image_gen',sourceOriginal=str(original.relative_to(ROOT)),originalBytes=original.stat().st_size,originalSha256=sha(original),variants=variants))
        (DOC/'KAI_MEDIA_SERVICES.json').write_text(json.dumps({'schemaVersion':1,'date':'2026-11-21','assets':service_catalog},indent=2)+'\n')
        print('New service illustrations:',len(service_catalog),'public bytes:',sum(v['bytes'] for a in service_catalog for v in a['variants'].values()))

# Exact current external About images were recovered once; rebuild from committed originals.
if not args.calendar_only and not args.services_only:
    recovered_manifest=DOC/'KAI_MEDIA_RECOVERED_EXTERNAL.json'
    if recovered_manifest.exists():
        recovered=json.loads(recovered_manifest.read_text())
        for item in recovered['assets']:
            original=ROOT/item['sourceOriginal']
            if sha(original)!=item['sourceSha256']:raise RuntimeError('Recovered source hash changed: '+str(original))
            with Image.open(original) as image:
                image.load();image=image.convert('RGB')
                for width in [1200,768]:
                    target=PUB/item['variants'][str(width)]['src'].lstrip('/')
                    item['variants'][str(width)]=webp(resize_width(image,width),target,80)
        recovered_manifest.write_text(json.dumps(recovered,indent=2)+'\n')
        print('Recovered current About originals:',len(recovered['assets']))
