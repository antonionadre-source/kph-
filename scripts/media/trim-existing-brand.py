#!/usr/bin/env python3
"""Trim fully transparent margins from the two existing logos; no AI, resize or recoloring."""
from pathlib import Path
from PIL import Image
import hashlib,json
ROOT=Path(__file__).resolve().parents[2]
rows=[]
for original_name,variant in [('logo-kraken-azul.webp','blue'),('logo-kraken-blanco.webp','white')]:
    source=ROOT/'public'/original_name;before=hashlib.sha256(source.read_bytes()).hexdigest()
    with Image.open(source) as image:
        image.load();image=image.convert('RGBA')
        bounds=image.getchannel('A').getbbox()
        if not bounds:raise RuntimeError('Empty logo alpha')
        cropped=image.crop(bounds)
        target=ROOT/'public'/'kai-calendar'/'optimized'/'brand'/('logo-'+variant+'.webp')
        target.parent.mkdir(parents=True,exist_ok=True)
        cropped.save(target,format='WEBP',lossless=True,exact=True,method=6)
        with Image.open(target) as check:
            check.load();check=check.convert('RGBA')
            assert check.size==cropped.size
            # All decoded RGBA values, including antialiased logo pixels, remain identical.
            assert check.tobytes()==cropped.tobytes()
        assert hashlib.sha256(source.read_bytes()).hexdigest()==before
        render=cropped.resize((480,round(cropped.height*480/cropped.width)),Image.Resampling.LANCZOS)
        render_target=target.with_name('logo-'+variant+'-480.webp')
        render.save(render_target,format='WEBP',quality=90,method=6,exact=True)
        with Image.open(render_target) as render_check:
            render_check.load();assert render_check.mode=='RGBA' and render_check.size==render.size
        render_meta=dict(src='/'+str(render_target.relative_to(ROOT/'public')),width=render.width,height=render.height,bytes=render_target.stat().st_size,sha256=hashlib.sha256(render_target.read_bytes()).hexdigest(),method='LANCZOS resize from pixel-identical trimmed source; WebP quality90 with alpha')
        rows.append(dict(render480=render_meta,id=variant,source='/'+original_name,sourceSha256=before,sourceDimensions=list(image.size),cropBox=list(bounds),method='alpha greater than zero bounding box; no resize or pixel changes',src='/'+str(target.relative_to(ROOT/'public')),width=cropped.width,height=cropped.height,bytes=target.stat().st_size,sha256=hashlib.sha256(target.read_bytes()).hexdigest(),decodedRgbaIdenticalToOriginalCrop=True))
(ROOT/'docs'/'KAI_MEDIA_BRAND.json').write_text(json.dumps({'schemaVersion':1,'date':'2026-11-21','assets':rows},indent=2)+'\n')
print(json.dumps(rows,indent=2))
