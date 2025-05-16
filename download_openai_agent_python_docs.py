#!/usr/bin/env python3
"""
Script to download the OpenAI Agents Python repository and organize its documentation
"""

import os
import shutil
import sys
import time
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

def download_github_repo(repo_url, download_path):
    """Download a GitHub repository as a zip file"""
    print_status(f"Downloading repository from {repo_url}")
    
    # GitHub provides a zip download link for any branch
    zip_url = f"{repo_url}/archive/refs/heads/main.zip"
    print_status(f"Download URL: {zip_url}")
    
    try:
        print_status("Downloading ZIP file...")
        response = requests.get(zip_url, stream=True)
        response.raise_for_status()
        
        # Save the zip file
        with open(download_path, 'wb') as f:
            for chunk in response.iter_content(chunk_size=8192):
                f.write(chunk)
        
        print_status("Download complete")
        return True
    except Exception as e:
        print_status(f"Error during download: {str(e)}")
        return False

def extract_repo(zip_path, extract_path):
    """Extract the repository zip file"""
    try:
        print_status(f"Extracting {zip_path} to {extract_path}")
        with zipfile.ZipFile(zip_path, 'r') as zip_ref:
            zip_ref.extractall(extract_path)
        
        # Find the extracted directory (it usually has a -main suffix)
        extracted_dirs = [d for d in Path(extract_path).iterdir() if d.is_dir()]
        if not extracted_dirs:
            print_status("Error: No directories found after extraction")
            return None
        
        # First directory is the extracted repo
        return extracted_dirs[0]
    except Exception as e:
        print_status(f"Error during extraction: {str(e)}")
        return None

def main():
    print_status("Starting download of OpenAI Agents Python repository")
    
    # Set up directories
    work_dir = Path.cwd()
    temp_dir = work_dir / "temp_repo"
    zip_file = temp_dir / "repo.zip"
    extract_dir = temp_dir / "extract"
    target_dir = work_dir / "openai-agents-python-docs"
    
    # Clean up any existing temp_repo folder
    if temp_dir.exists():
        try:
            print_status(f"Removing existing temp directory: {temp_dir}")
            shutil.rmtree(temp_dir)
        except Exception as e:
            print_status(f"Warning: Could not remove temp directory: {str(e)}")
    
    # Create fresh directories
    print_status("Creating directories")
    try:
        temp_dir.mkdir(exist_ok=True)
        extract_dir.mkdir(exist_ok=True)
        if not target_dir.exists():
            target_dir.mkdir()
    except Exception as e:
        print_status(f"Error creating directories: {str(e)}")
        return 1
    
    # Download the repository zip
    if not download_github_repo("https://github.com/openai/openai-agents-python", zip_file):
        return 1
    
    # Extract the repository
    repo_dir = extract_repo(zip_file, extract_dir)
    if not repo_dir:
        print_status("Failed to extract repository")
        return 1
    
    print_status(f"Repository extracted to: {repo_dir}")
    
    # Move docs folder
    print_status("Moving docs folder")
    docs_src = repo_dir / "docs"
    if docs_src.exists():
        # Copy all files from docs to target directory
        for item in docs_src.glob("*"):
            if item.is_dir():
                # Skip the scripts folder
                if item.name == "scripts":
                    print_status(f"  Skipping scripts directory: {item.name}")
                    continue
                    
                # Copy other directories
                print_status(f"  Copying directory: {item.name}")
                target_subdir = target_dir / item.name
                if target_subdir.exists():
                    shutil.rmtree(target_subdir)
                shutil.copytree(item, target_subdir)
            else:
                # Copy files
                print_status(f"  Copying file: {item.name}")
                shutil.copy2(item, target_dir)
    else:
        print_status("Warning: docs folder not found in repository")
    
    # Move examples folder
    print_status("Moving examples folder")
    examples_src = repo_dir / "examples"
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
    
    # Move README.md
    print_status("Moving README.md")
    readme_src = repo_dir / "README.md"
    if readme_src.exists():
        shutil.copy2(readme_src, target_dir / "README.md")
        print_status("  README.md copied successfully")
    else:
        print_status("Warning: README.md not found in repository")
    
    # Make sure scripts folder doesn't exist in the target directory
    scripts_dir = target_dir / "scripts"
    if scripts_dir.exists() and scripts_dir.is_dir():
        print_status(f"Removing scripts folder: {scripts_dir}")
        shutil.rmtree(scripts_dir)
    
    # Clean up temp_repo
    print_status("Cleaning up temporary files")
    try:
        shutil.rmtree(temp_dir)
        print_status("  Temporary directory removed successfully")
    except Exception as e:
        print_status(f"  Warning: Could not remove temp directory: {str(e)}")
    
    print_status("Successfully completed! Files have been moved to openai-agents-python-docs folder")
    print_status(f"Output directory: {os.path.abspath(target_dir)}")
    return 0

if __name__ == "__main__":
    sys.exit(main())
