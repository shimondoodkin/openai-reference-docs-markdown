from seleniumbase import SB
import os
import time
import traceback
import re
import json
from pathlib import Path
from urllib.parse import urljoin


# Special URL mappings where direct URL loading is needed instead of link clicking
# Format: href path -> full URL with query parameters
SPECIAL_URL_MAPPINGS = {
    "/docs/guides/image-generation-dall-e-3": "https://platform.openai.com/docs/guides/image-generation?image-generation-model=dall-e-3",
    "/docs/guides/image-generation-dall-e-2": "https://platform.openai.com/docs/guides/image-generation?image-generation-model=dall-e-2",
    "/docs/guides/voice-agents-chained": "https://platform.openai.com/docs/guides/voice-agents?voice-agent-architecture=chained"
}

def scrape_openai_docs():
    """
    Script to scrape OpenAI documentation page by page and save each page as a Markdown file.
    Uses a queue-based approach to handle page reloads and incrementally update links.
    Also handles special cases where pages need specific query parameters.
    """
    # Create output directory if it doesn't exist
    output_dir = Path('./openai-docs-guides')
    output_dir.mkdir(exist_ok=True)
    
    # Keep track of visited pages and found links
    visited = set()
    
    with SB(uc=True, test=True, locale="en", headless=False) as sb:
        try:
            # Starting URL
            base_url = "https://platform.openai.com/docs/overview"
            sb.activate_cdp_mode(base_url, timeout=10)
            sb.page_load_timeout = 10
            
            # Wait for initial page load
            sb.sleep(3)
            
            # Handle captcha if present
            try:
                sb.uc_gui_click_captcha(timeout=5)
            except Exception:
                pass
            
            # Patch clipboard to capture copied content
            sb.execute_script("""
                (() => {
                    const origWriteText = navigator.clipboard.writeText.bind(navigator.clipboard);
                    window.copied = null;
                    navigator.clipboard.writeText = async function (text) {
                        window.copied = text;
                        return origWriteText(text);
                    };
                })();
            """)
            
            # Initially get all links from the sidebar
            links = get_sidebar_links(sb)
            
            # Initialize queue with links that haven't been visited
            queue = [link for link in links if link['href'] not in visited]
            
            # Add special URLs to the queue with their mappings
            for special_href in SPECIAL_URL_MAPPINGS.keys():
                if special_href not in [link['href'] for link in queue] and special_href not in visited:
                    queue.append({
                        'href': special_href,
                        'text': f"Special: {special_href}"
                    })
                    print(f"Added special URL to queue: {special_href}")
            
            print(f"Found {len(queue)} initial links to process (including special URLs)")
            
            # Process links one by one
            while queue:
                # Take the first link from the queue
                current_link = queue.pop(0)
                href = current_link['href']
                
                if href in visited:
                    continue
                
                print(f"Processing: {href}")
                visited.add(href)
                
                try:
                    # Check if this is a special URL that needs direct navigation with query params
                    if href in SPECIAL_URL_MAPPINGS:
                        full_url = SPECIAL_URL_MAPPINGS[href]
                        print(f"Using special URL mapping: {href} -> {full_url}")
                        # Navigate directly to the special URL
                        sb.activate_cdp_mode(full_url, timeout=10)
                        sb.sleep(10)
                    else:
                        continue
                        # Standard behavior for regular URLs
                        full_url = f"https://platform.openai.com{href}"
                        
                        # Try to click the link using Selenium first
                        try:
                            sidebar_link = sb.find_element('css selector', f'a[href="{href}"]')
                            sidebar_link.click()
                        except Exception as e:
                            print(f"Selenium click failed: {str(e)}")
                            # Try JavaScript click
                            try:
                                click_success = sb.execute_script(f'''
                                    (() => {{
                                        var link = document.querySelector('a[href="{href}"]'); 
                                        if(link) {{
                                            link.click();
                                            return true;
                                        }}
                                        return false;
                                    }})();
                                ''')
                                if not click_success:
                                    print(f"JavaScript click failed, navigating directly to {full_url}")
                                    # If element not found, navigate directly to URL
                                    sb.activate_cdp_mode(full_url, timeout=10)
                            except Exception as e:
                                print(f"JavaScript click failed: {str(e)}, navigating directly to {full_url}")
                                # Final fallback: direct navigation
                                sb.activate_cdp_mode(full_url, timeout=10)
                    
                    # Wait for page to load
                    sb.sleep(1.5)
                    
                    # Reset clipboard content
                    sb.execute_script("(() => { window.copied = null; })();")
                    
                    # Look for a copy button and click it
                    copy_btn_exists = sb.execute_script("""
                        (() => {
                            const copyBtn = document.querySelector('button.copy-button');
                            let result = false;
                            if (copyBtn) {
                                copyBtn.click();
                                result = true;
                            }
                            return result;
                        })();
                    """)
                    
                    if copy_btn_exists:
                        sb.sleep(0.5)  # Wait for clipboard operation
                    
                    # Get the content from clipboard or directly from the page
                    content = sb.execute_script("""
                        (() => {
                            let content;
                            if (window.copied) {
                                content = window.copied;
                            } else {
                                // Fallback: get content from main content area
                                const contentEl = document.querySelector('.main-content');
                                content = contentEl ? contentEl.innerText : null;
                            }
                            return content;
                        })();
                    """)
                    
                    # Save content if available
                    if content:
                        # Convert href to proper file path with directories
                        file_path = get_file_path(href, output_dir)
                        
                        with open(file_path, 'w', encoding='utf-8') as f:
                            f.write(content)
                        
                        print(f"Saved: {file_path.relative_to(output_dir)}")
                    else:
                        print(f"Warning: No content found for {href}")
                    
                    # Get updated links after visiting this page
                    updated_links = get_sidebar_links(sb)
                    
                    # Add any new links to the beginning of the queue
                    new_links = []
                    for link in updated_links:
                        if link['href'] not in visited:
                            if not any(l['href'] == link['href'] for l in queue):
                                new_links.append(link)
                    
                    # Prepend new links to queue so they're processed next
                    queue = new_links + queue
                    
                    print(f"Queue length: {len(queue)}, Visited: {len(visited)}")
                    
                    # Small delay between pages to avoid rate limiting
                    sb.sleep(0.5)
                    
                except Exception as e:
                    print(f"Error processing {href}: {str(e)}")
                    traceback.print_exc()
            
            print("Scraping completed successfully!")
            return True
            
        except Exception as e:
            print(f"Exception in scrape_openai_docs: {str(e)}")
            traceback.print_exc()
            return False


def get_sidebar_links(sb):
    """Get all sidebar links from the current page"""
    links = sb.execute_script("""
        (() => {
            var links = Array.from(document.querySelectorAll('.scroll-link.side-nav-item'));
            var result = [];
            
            for (var i = 0; i < links.length; i++) {
                var link = links[i];
                if (link.target !== '_blank' && link.href) {
                    result.push({
                        href: link.getAttribute('href'),
                        text: link.textContent.trim()
                    });
                }
            }
            
            return result;
        })();
    """)
    return links


def get_file_path(href, output_dir):
    """Convert href to a proper file path with directories"""
    # Remove leading slash
    clean_path = re.sub(r'^/docs', '', href)
    clean_path = re.sub(r'^/', '', clean_path)
    
    # Create full path with output directory
    file_path = output_dir / (clean_path + '.md')
    
    # Ensure parent directories exist
    file_path.parent.mkdir(parents=True, exist_ok=True)
    
    return file_path


if __name__ == "__main__":
    print("Starting OpenAI docs scraper. This will save all documentation pages to ./openai-docs/ folder.")
    scrape_openai_docs()
