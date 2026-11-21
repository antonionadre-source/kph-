#!/usr/bin/env python3
"""Read-only local image inventory. Requires Pillow; never replaces or deletes files."""
from pathlib import Path
from PIL import Image
import argparse
import json
import re
import urllib.parse
import xml.etree.ElementTree as ET

parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument('--root', type=Path, default=Path(__file__).resolve().parents[1])
parser.add_argument('--output', type=Path, help='Optional JSON report destination')
args = parser.parse_args()
root = args.root.resolve()
public = root / 'public'
extensions = {'.png', '.jpg', '.jpeg', '.webp', '.gif', '.svg', '.ico', '.avif', '.bmp'}
refs = {}
pattern = re.compile(r'''["'`](?:https://krakenpfm\.ch)?(/[A-Za-z0-9_%][^"'`<>\r\n]*?\.(?:png|jpe?g|webp|gif|svg|ico|avif|bmp))(?:[?#][^"'`<>\r\n]*)?["'`]''', re.I)
for source in root.rglob('*'):
    if not source.is_file() or any(part in {'.git', 'node_modules', 'dist', 'docs', 'work', '.venv', '.venv-assets', '.vercel', 'assets-source', 'tests'} for part in source.relative_to(root).parts):
        continue
    if source.relative_to(root).parts[:2] == ('public', 'assets'):
        continue
    if source.suffix not in {'.ts', '.tsx', '.js', '.jsx', '.css', '.html', '.json', '.webmanifest'}:
        continue
    for number, line in enumerate(source.read_text(errors='replace').splitlines(), 1):
        for match in pattern.finditer(line):
            path = urllib.parse.unquote(match.group(1))
            if '${' in path:
                continue
            refs.setdefault(path, []).append(f'{source.relative_to(root)}:{number}')
paths = set(refs) | {'/' + str(p.relative_to(public)) for p in public.rglob('*') if p.is_file() and p.suffix.lower() in extensions}
rows = []
for path in sorted(paths):
    file = public / path.lstrip('/')
    row = {'path': path, 'references': refs.get(path, []), 'bytes': file.stat().st_size if file.exists() else 0}
    try:
        if not file.exists():
            raise FileNotFoundError('Missing local image')
        if file.suffix.lower() == '.svg':
            tree = ET.parse(file)
            if tree.getroot().tag.split('}')[-1] != 'svg':
                raise ValueError('Not an SVG document')
            row.update(status='valid', format='SVG')
        else:
            with Image.open(file) as image:
                image.load()  # Decode all pixels, rather than trusting the signature.
                row.update(format=image.format, dimensions=list(image.size))
            with Image.open(file) as image:
                image.verify()  # Also check PNG chunk CRCs and structural integrity.
            row['status'] = 'valid'
    except Exception as error:
        row.update(status='invalid' if file.exists() else 'missing', error=str(error))
    rows.append(row)
summary = {
    'totalPaths': len(rows),
    'valid': sum(r['status'] == 'valid' for r in rows),
    'invalid': sum(r['status'] == 'invalid' for r in rows),
    'missing': sum(r['status'] == 'missing' for r in rows),
    'referencedInvalid': sum(r['status'] == 'invalid' and bool(r['references']) for r in rows),
    'referencedMissing': sum(r['status'] == 'missing' and bool(r['references']) for r in rows),
}
source_rows = []
for source in sorted((root / 'src' / 'assets' / 'images').glob('*')):
    if not source.is_file() or source.suffix.lower() not in extensions:
        continue
    row = {'path': str(source.relative_to(root)), 'bytes': source.stat().st_size}
    try:
        with Image.open(source) as image:
            image.load()
            row.update(format=image.format, dimensions=list(image.size))
        with Image.open(source) as image:
            image.verify()
        row['status'] = 'valid'
    except Exception as error:
        row.update(status='invalid', error=str(error))
    source_rows.append(row)
report = {'summary': summary, 'assets': rows, 'sourceAssets': source_rows}
if args.output:
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(json.dumps(report, indent=2, ensure_ascii=False) + '\n')
print(json.dumps(summary, ensure_ascii=False))
for row in rows:
    if row['status'] != 'valid' and row['references']:
        print(f"{row['status']}: {row['path']} — {', '.join(row['references'])}")
