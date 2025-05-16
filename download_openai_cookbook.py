#!/usr/bin/env python3
"""
Script to download the OpenAI Cookbook repository
"""

import os
import shutil
import sys
import tempfile
import time
import uuid
from pathlib import Path

# Try to import requests, install if not available
try:
    import requests
except ImportError:
    print("Requests library not found. Installing...")
    import subprocess
    subprocess.check_call([sys.executable, "-m", "pip", "install", "requests"])
    import requests

import zipfile

def print_status(message):
    """Print a status message"""
    print(f"[{time.strftime('%H:%M:%S')}] {message}")

def download_github_repo(repo_url, extract_to):
    """Download a GitHub repository as a zip file and extract it"""
    print_status(f"Downloading repository from {repo_url}")
    
    # GitHub provides a zip download link for any branch
    zip_url = f"{repo_url}/archive/refs/heads/main.zip"
    print_status(f"Download URL: {zip_url}")
    
    # Download the zip file
    with tempfile.NamedTemporaryFile(suffix='.zip', delete=False) as temp_file:
        temp_path = temp_file.name
    
    try:
        print_status("Downloading ZIP file...")
        response = requests.get(zip_url, stream=True)
        response.raise_for_status()  # Raise an exception for HTTP errors
        
        with open(temp_path, 'wb') as f:
            for chunk in response.iter_content(chunk_size=8192):
                f.write(chunk)
                
        print_status("Download complete")
        
        # Extract the zip file
        print_status("Extracting files...")
        with zipfile.ZipFile(temp_path, 'r') as zip_ref:
            zip_ref.extractall(extract_to)
        
        # Find the extracted directory (it usually has a -main suffix)
        extracted_dirs = [d for d in extract_to.iterdir() if d.is_dir()]
        if not extracted_dirs:
            print_status("Error: No directories found after extraction")
            return False
        
        # Get the extracted directory but don't rename it
        extracted_dir = extracted_dirs[0]  # First directory found
        print_status(f"Using extracted directory: {extracted_dir.name}")
        return extracted_dir
    except Exception as e:
        print_status(f"Error during download: {str(e)}")
        return False
    finally:
        # Clean up the temporary zip file
        if os.path.exists(temp_path):
            os.unlink(temp_path)

def main():
    print_status("Starting download of OpenAI Cookbook repository")
    
    # Create a unique temporary directory using system temp dir
    unique_id = str(uuid.uuid4())[:8]
    temp_repo = Path(tempfile.gettempdir()) / f"openai-cookbook-temp-{unique_id}"
    print_status(f"Creating temporary directory: {temp_repo}")
    try:
        temp_repo.mkdir(exist_ok=True)
    except Exception as e:
        print_status(f"Error creating temporary directory: {str(e)}")
        return 1
    
    # Download the repository
    repo_path = download_github_repo(
        "https://github.com/openai/openai-cookbook",
        temp_repo
    )
    
    if not repo_path:
        print_status("Failed to download repository")
        return 1
    
    # Create target directory
    target_dir = Path("openai-cookbook")
    if target_dir.exists():
        print_status(f"Target directory {target_dir} already exists, removing it...")
        try:
            shutil.rmtree(target_dir)
        except Exception as e:
            print_status(f"Error removing existing target directory: {str(e)}")
            return 1
    
    # Create fresh target directory
    target_dir.mkdir()
    
    # Copy all content from repo to target directory
    print_status("Copying repository contents...")
    
    # Get a list of all items in the repo
    items = list(repo_path.glob('*'))
    excluded_items = ['.github', 'authors.yaml', 'registry.yaml']
    
    # Copy all items except the excluded ones
    for item in items:
        item_name = item.name
        if item_name in excluded_items:
            print_status(f"  Skipping excluded item: {item_name}")
            continue
        
        target_path = target_dir / item_name
        if item.is_dir():
            print_status(f"  Copying directory: {item_name}")
            shutil.copytree(item, target_path)
        else:
            print_status(f"  Copying file: {item_name}")
            shutil.copy2(item, target_path)
    
    # Clean up temp directory
    print_status("Cleaning up temporary files")
    try:
        shutil.rmtree(temp_repo)
        print_status("  Temporary directory removed successfully")
    except Exception as e:
        print_status(f"  Warning: Could not remove temp directory: {str(e)}")
    
    # Verify the target directory contents
    print_status("Verifying target directory contents...")
    copied_items = list(target_dir.glob('*'))
    print_status(f"Copied {len(copied_items)} items to {target_dir}")
    
    # Check if any excluded items were accidentally copied
    for excluded in excluded_items:
        if (target_dir / excluded).exists():
            print_status(f"WARNING: Excluded item {excluded} was found in target directory!")
            print_status(f"Removing {excluded}...")
            
            if (target_dir / excluded).is_dir():
                shutil.rmtree(target_dir / excluded)
            else:
                os.remove(target_dir / excluded)
    
    print_status("Successfully completed! OpenAI Cookbook has been downloaded to the openai-cookbook folder")
    print_status(f"Output directory: {os.path.abspath(target_dir)}")
    return 0

if __name__ == "__main__":
    sys.exit(main())
