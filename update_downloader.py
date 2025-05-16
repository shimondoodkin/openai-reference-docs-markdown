from socket import timeout
from seleniumbase import SB
import json
import os
import time
import traceback
from datetime import datetime


def download_openai_js_files():
    """
    Script to open the OpenAI API reference page, wait 10 seconds,
    then download all JavaScript files and return their content.
    """
    # Dictionary to store JS contents
    js_contents = {}
    
    with SB(uc=True, test=True, locale="en", headless=False) as sb:
        try:
            # Target URL
            url = "https://platform.openai.com/docs/api-reference/"
            sb.activate_cdp_mode(url,timeout=10)
            # sb.timeout=60
            # sb.script.timeout=600
            sb.page_load_timeout=10
            sb.sleep(8)
            # sb.uc_gui_click_captcha()
            # Handle captcha if present
            try:
                sb.uc_gui_click_captcha(timeout=8)
            except Exception:
                pass
            print("find files on load")
            # Find all JavaScript files using JavaScript in the browser
            js_files = sb.execute_script("""
                // Method 1: Find scripts from DOM
                var scriptTags = Array.from(document.querySelectorAll('script[src]'))
                    .map(s => s.src)
                    .filter(src => src.includes('.js'));
                // Method 2: Find from performance entries
                var perfEntries = performance.getEntriesByType('resource')
                    .filter(r => r.initiatorType === 'script' || r.name.includes('.js'))
                    .map(r => r.name);
                // Combine and remove duplicates
                [...new Set([...scriptTags, ...perfEntries])];
            """,timeout=10)
            print("found files on load",js_files)

            # Download each JS file and process only the one that matches the required content
            import re
            found_any=False
            for js_url in js_files:
                try:
                    print("found file",js_url)
                    # Use XMLHttpRequest which is more reliable than fetch
                    try:
                        content = sb.execute_script("""
                            var url = '"""+js_url+"""';
                            var xhr = new XMLHttpRequest();
                            xhr.open('GET', url, false);  // false makes it synchronous
                            var result=null;
                            try {
                                xhr.send(null);
                                if (xhr.status === 200) {
                                    result=xhr.responseText;
                                }
                            } catch (error) {
                                console.error('XHR error:', error);
                            }
                            result;
                        """, timeout=1)
                        sb.sleep(1)
                    except Exception as e:
                        print(f"ERROR in execute_script: {str(e)}")
                        content = None

                    if content:
                        print("successfully got contents for file",js_url)
                     
                    # If browser approach fails, try Python requests as backup
                    if not content:
                        try:
                            import requests
                            response = requests.get(js_url, timeout=15)
                            if response.status_code == 200:
                                content = response.text
                                print(f"Got content via requests instead: {len(content)} bytes")
                        except Exception as e:
                            print(f"ERROR in requests: {str(e)}")
                            content = None

                    # Check if content exists before trying to print its properties
                    try:
                        if content is not None:
                            print("content size", len(content))   
                            print("content sample", content[:100])
                        else:
                            print("WARNING: Content is None for", js_url)
                    except Exception as e:
                        print(f"ERROR printing content info: {str(e)}")

                    # Process content
                    if content and content.startswith('const e=[{id:"introduction",type:"markdown",'):
                        print("***found matching file - saving it***")
                        # Modify export statement as requested
                        modified_content = re.sub(
                            r'export\s*\{\s*(\w+)\s+as\s+A\s*,\s*(\w+)\s+as\s+a\s*\}\s*;?\s*$',
                            r'module.exports={A:\1,a:\2};',
                            content,
                            flags=re.MULTILINE
                        )
                        output_path = os.path.join(os.getcwd(), "openai-docs-reference.js")
                        with open(output_path, "w", encoding="utf-8") as f:
                            f.write(modified_content)
                        # Only save the first match and stop
                        found_any=True

                        break
                except Exception as e:
                    print(f"Error processing {js_url}: {str(e)}")
                    traceback.print_exc()
            if found_any:
                return {js_url: output_path}
            else:
                print("no matching file found")
            return None
        except Exception:
            print("Exception in download_openai_js_files")
            traceback.print_exc()
            return None

if __name__ == "__main__":
    print("run this file on a windows machine on desktop mode. wait about 1 minute. it will close itself after long time. and make openai-docs-reference.js file")
    download_openai_js_files()
