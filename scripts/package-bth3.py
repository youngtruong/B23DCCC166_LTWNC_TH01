"""Create a source submission without dependencies, build output or secrets."""
from pathlib import Path
from zipfile import ZipFile, ZIP_DEFLATED
root = Path(__file__).resolve().parent.parent
out = root / 'outputs' / 'B23DCCC166_BTH3_Class_Deadline_Hub.zip'
excluded = {'node_modules', '.git', '.next', '.vinext', '.wrangler', '.sites-runtime', '.agents', '.codex', '.openai', 'dist', 'coverage', 'outputs', 'work', '__pycache__'}
out.parent.mkdir(exist_ok=True)
with ZipFile(out, 'w', ZIP_DEFLATED) as archive:
    for file in sorted(root.rglob('*')):
        relative = file.relative_to(root)
        if set(relative.parts) & excluded or not file.is_file():
            continue
        if file.name.startswith('.env') and file.name != '.env.example':
            continue
        if file.name.endswith(('.tsbuildinfo', '.tmp')) or file.name in {'next-env.d.ts', '.DS_Store', 'failure.png', 'dashboard-debug.png'}:
            continue
        archive.write(file, Path('B23DCCC166_BTH3') / relative)
with ZipFile(out) as archive:
    assert archive.testzip() is None
    assert not any('/node_modules/' in n or '/.next/' in n or n.endswith('.env.local') for n in archive.namelist())
print(out)
print(f'{out.stat().st_size / 1048576:.2f} MB')
