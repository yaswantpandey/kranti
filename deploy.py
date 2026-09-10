import os
import ftplib
import sys

FTP_HOST = os.getenv("FTP_HOST")
FTP_PORT = int(os.getenv("FTP_PORT", 21))
FTP_USER = os.getenv("FTP_USER")
FTP_PASS = os.getenv("FTP_PASS")
REMOTE_TARGET_DIR = os.getenv("FTP_TARGET_DIR")

# Files and directories to exclude
EXCLUDE_NAMES = {
    ".git",
    "sync_config.jsonc",
    "ftp.txt",
    "deploy.py",
    "__pycache__",
    ".DS_Store"
}

def log(msg):
    print(msg, flush=True)

def ensure_remote_dir(ftp, remote_dir):
    parts = [p for p in remote_dir.split('/') if p]
    current = ""
    for part in parts:
        current += "/" + part
        try:
            ftp.cwd(current)
        except ftplib.error_perm:
            try:
                ftp.mkd(current)
                log(f"Created remote directory: {current}")
            except Exception as e:
                log(f"Directory {current} status: {e}")

def upload_directory(ftp, local_dir, remote_base):
    for root, dirs, files in os.walk(local_dir):
        dirs[:] = [d for d in dirs if d not in EXCLUDE_NAMES]
        
        rel_path = os.path.relpath(root, local_dir)
        if rel_path == ".":
            remote_dir = remote_base
        else:
            remote_dir = remote_base + "/" + rel_path.replace("\\", "/")
            
        ensure_remote_dir(ftp, remote_dir)
        ftp.cwd(remote_dir)
        
        for file in files:
            if file in EXCLUDE_NAMES:
                continue
            local_file_path = os.path.join(root, file)
            display_path = file if rel_path == "." else f"{rel_path}/{file}"
            log(f"Uploading: {display_path} -> {remote_dir}/{file}")
            try:
                with open(local_file_path, "rb") as f:
                    ftp.storbinary(f"STOR {file}", f)
            except Exception as err:
                log(f"❌ Error uploading {display_path}: {err}")

def main():
    missing = [
        name for name, value in {
            "FTP_HOST": FTP_HOST,
            "FTP_USER": FTP_USER,
            "FTP_PASS": FTP_PASS,
            "FTP_TARGET_DIR": REMOTE_TARGET_DIR,
        }.items() if not value
    ]
    if missing:
        raise RuntimeError(f"Missing required environment variables: {', '.join(missing)}")

    log(f"Connecting to FTP server {FTP_HOST}...")
    ftp = ftplib.FTP()
    ftp.connect(FTP_HOST, FTP_PORT, timeout=30)
    ftp.login(FTP_USER, FTP_PASS)
    ftp.set_pasv(True)
    log("Logged in successfully!")

    log(f"Target directory: {REMOTE_TARGET_DIR}")
    ensure_remote_dir(ftp, REMOTE_TARGET_DIR)
    
    local_workspace = os.path.dirname(os.path.abspath(__file__))
    upload_directory(ftp, local_workspace, REMOTE_TARGET_DIR)
    
    ftp.quit()
    log("\n✅ All files uploaded successfully to krantifurniture.in/htdocs!")

if __name__ == "__main__":
    main()