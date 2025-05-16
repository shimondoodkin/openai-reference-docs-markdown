# OpenAI Documentation Converter

A utility for downloading and converting OpenAI's documentation into markdown format, making it more accessible for AI agents and other applications.

## Overview

This project solves the problem of having OpenAI's documentation in a markdown format that can be easily used by AI agents. It consists of two main components:

1. **Python Scraper**: Downloads the latest OpenAI documentation and creates a reference file (`openai-docs-reference.js`)
2. **TypeScript Converter**: Transforms the reference file into well-structured markdown files

## Prerequisites

- Python 3.x
- Node.js and npm

## Installation

### Python Dependencies

Install the required Python package:

```bash
# create venv if you like:
python -m venv venv --clean

# activate venv
.venv\Scripts\activate.bat

# install dependencies
python -m pip install seleniumbase
```

### Node.js Dependencies

Install the required Node.js packages:

```bash
npm install
```

## Usage

### Step 1: Update Documentation Reference

Run the Python utility to download the latest OpenAI documentation:

```bash
# Command to run the Python update utility
# (This will download and update the openai-docs-reference.js file)
python update_downloader.py
```

after running the file, the folder downloaded_files is created by seleniumbase - it can be deleted.  

### Step 2: Convert to Markdown

Before running the conversion utility, you may want to delete the output folder `openai-docs-api-reference` to ensure a clean generation.


Run the TypeScript converter:

```bash
npx ts-node src/convertDocs.ts
```

This will generate markdown files in the `openai-docs-api-reference` directory.

## Project Structure

```
openai-docs-converter/
├── update_downloader.py  # Python scraper
├── old-junk  # folder with initial sources
├── src/
│   ├── types.ts           # Types
│   └── convertDocs.ts     # TypeScript converter
├── openai-docs-reference.js   # Downloaded reference file
├── openai-docs-api-reference/ # Generated markdown files
├── make_docs.bat # batch file to run the conversion
├── downloaded_files # if you have downloaded_files it is created automatically and can be deleted
├── package.json
├── requirements.txt # i executed pip freeze to generate it, but it is only from installing seleniumbase
├── tsconfig.json
└── README.md
```

## Why This Project?

This project was created to address the lack of easily accessible markdown versions of OpenAI's documentation. Having documentation in markdown format is particularly beneficial for AI agents, which can more effectively utilize and process content in this format.

## License

ISC
