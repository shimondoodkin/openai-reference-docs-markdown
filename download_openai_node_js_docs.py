#!/usr/bin/env python3
"""
Version 1.4
Script to download the OpenAI Node.js repository and organize its documentation
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
        target_dir = extracted_dir  # Just use the directory as-is
        return True
    except Exception as e:
        print_status(f"Error during download: {str(e)}")
        return False
    finally:
        # Clean up the temporary zip file
        if os.path.exists(temp_path):
            os.unlink(temp_path)

def main():
    print_status("Starting download of OpenAI Node.js repository")
    
    # Create a unique temporary directory using system temp dir
    unique_id = str(uuid.uuid4())[:8]
    temp_repo = Path(tempfile.gettempdir()) / f"openai-node-temp-{unique_id}"
    print_status(f"Creating temporary directory: {temp_repo}")
    try:
        temp_repo.mkdir(exist_ok=True)
    except Exception as e:
        print_status(f"Error creating temporary directory: {str(e)}")
        return 1
    
    # Download the repository
    success = download_github_repo(
        "https://github.com/openai/openai-node",
        temp_repo
    )
    
    if not success:
        print_status("Failed to download repository")
        return 1
    
    # Find the extracted directory (usually has -main suffix)
    extracted_dirs = [d for d in temp_repo.iterdir() if d.is_dir()]
    if not extracted_dirs:
        print_status("Repository directory not found after extraction!")
        return 1
        
    repo_path = extracted_dirs[0]  # Use the extracted directory
    if not repo_path.exists():
        print_status("Repository directory not found after cloning!")
        return 1
    
    # Create target directory
    target_dir = Path("openai-node-js-docs")
    if not target_dir.exists():
        target_dir.mkdir()
    
    # Copy only root .md files (not in subdirectories), excluding specific files
    print_status("Copying root .md files")
    excluded_files = ["CONTRIBUTING.md", "SECURITY.md"]
    md_files = list(repo_path.glob('*.md'))
    
    # Remove excluded files if they exist in the target directory
    for excluded in excluded_files:
        excluded_path = target_dir / excluded
        if excluded_path.exists():
            print_status(f"  Removing excluded file: {excluded}")
            os.remove(excluded_path)
    
    for md_file in md_files:
        # Skip excluded files
        if md_file.name in excluded_files:
            print_status(f"  Skipping excluded file: {md_file.name}")
            continue
            
        # Copy the file directly to target directory
        print_status(f"  Copying file: {md_file.name}")
        shutil.copy2(md_file, target_dir / md_file.name)
    
    print_status(f"Copied {len(md_files)} markdown files")
    
    # Copy examples folder
    print_status("Copying examples folder")
    examples_src = repo_path / "examples"
    examples_dest = target_dir / "examples"
    if examples_src.exists():
        if examples_dest.exists():
            print_status("  Removing existing examples directory")
            shutil.rmtree(examples_dest)
        print_status("  Copying examples directory and contents")
        shutil.copytree(examples_src, examples_dest)
        file_count = len(list(examples_dest.glob('**/*')))
        print_status(f"  Examples directory copied with {file_count} files")
    else:
        print_status("Warning: examples folder not found in repository")
    
    # Copy tests folder - first search for it case-insensitively
    print_status("Looking for tests folder")
    tests_folders = [d for d in repo_path.glob('*') if d.is_dir() and d.name.lower() in ('test', 'tests')]
    
    if tests_folders:
        tests_src = tests_folders[0]  # Use the first found test directory
        print_status(f"Found tests folder: {tests_src.name}")
        tests_dest = target_dir / "tests"
        
        if tests_dest.exists():
            print_status("  Removing existing tests directory")
            shutil.rmtree(tests_dest)
            
        try:
            print_status(f"  Copying tests directory and contents from {tests_src}")
            shutil.copytree(tests_src, tests_dest)
            file_count = len(list(tests_dest.glob('**/*')))
            print_status(f"  Tests directory copied with {file_count} files")
        except Exception as e:
            print_status(f"Error copying tests directory: {str(e)}")
    else:
        print_status("Warning: No tests folder found in repository")
        print_status("Listing repository root directories for debugging:")
        for d in repo_path.glob('*'):
            if d.is_dir():
                print_status(f"  Found directory: {d.name}")
    
    # Check if the tests directory was successfully copied
    if (target_dir / "tests").exists():
        print_status("Tests directory was successfully copied")
    else:
        print_status("Tests directory was not copied successfully")
    
    # Check if only the desired content was copied
    print_status("Contents of the target directory:")
    allowed_dirs = ["examples", "tests"]
    for item in target_dir.glob('*'):
        if item.is_dir():
            if item.name in allowed_dirs:
                print_status(f"  Directory (wanted): {item.name} with {len(list(item.glob('**/*')))} files")
            else:
                print_status(f"  Directory (UNWANTED): {item.name} - please delete this manually")
        else:
            if item.suffix.lower() == ".md":
                print_status(f"  File (wanted): {item.name}")
            else:
                print_status(f"  File (UNWANTED): {item.name} - please delete this manually")
    
    # Clean up temp_repo
    print_status("Cleaning up temporary files")
    try:
        shutil.rmtree(temp_repo)
        print_status("  Temporary directory removed successfully")
    except Exception as e:
        print_status(f"  Warning: Could not remove temp directory: {str(e)}")
        
    # If the temp directory couldn't be removed, at least list what's in it
    if temp_repo.exists():
        print_status("Contents of temp directory that couldn't be removed:")
        for item in temp_repo.glob('*'):
            print_status(f"  {item}")
    
    print_status("Successfully completed! Files have been moved to openai-node-js-docs folder")
    print_status(f"Output directory: {os.path.abspath(target_dir)}")
    return 0

if __name__ == "__main__":
    sys.exit(main())
