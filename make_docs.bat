call venv\Scripts\activate.bat

::download open ai references
python update_downloader.py
npx ts-node src\convertDocs.ts

::scrape docs guides
python scrape-docs.py

::download open ai python docs
python download_openai_python_docs.py

::download open ai agents python docs
python download_openai_agents_python_docs.py

::download openai node js docs
python download_openai_node_js_docs.py

::download openai cookbook  
python download_openai_cookbook.py

::create/update last_update.txt with current date
python -c "import datetime; print(datetime.datetime.now().strftime('%Y-%m-%d'))" > last_update.txt
