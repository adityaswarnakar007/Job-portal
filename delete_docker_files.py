from pathlib import Path

repo_root = Path(r"d:\job")
files = [
    "Dockerfile",
    "docker-compose.yml",
    "docker-entrypoint.sh",
    ".dockerignore",
    "docker_compose_log.txt",
    "docker_output.txt",
]

for file_name in files:
    path = repo_root / file_name
    if path.exists():
        path.unlink()
        print(f"deleted {file_name}")
    else:
        print(f"missing {file_name}")

remaining = [p.name for p in repo_root.iterdir() if p.name in files]
print("remaining:", remaining)
