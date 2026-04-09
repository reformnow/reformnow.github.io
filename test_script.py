from playwright.sync_api import sync_playwright
import time

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page(viewport={'width': 1280, 'height': 800})
        page.goto('http://127.0.0.1:4000/')
        
        # Test Chinese mode
        print("Waiting for load...")
        time.sleep(2)
        
        # Switch to bilingual using JS
        page.evaluate("setLanguageView('both')")
        time.sleep(1)
        
        # Get elements
        lastmod = page.query_selector('#access-lastmod')
        if not lastmod:
            print("#access-lastmod not found on HOME page in both mode!")
        else:
            print("#access-lastmod found. Visibility:", page.evaluate("el => window.getComputedStyle(el).display", lastmod))
            print("Content:", lastmod.inner_text())
            heading = page.query_selector('#access-lastmod .panel-heading')
            print("Heading display:", page.evaluate("el => window.getComputedStyle(el).display", heading))
            
        browser.close()

run()
