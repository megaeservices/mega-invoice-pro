from playwright.sync_api import sync_playwright

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    context = browser.new_context()
    page = context.new_page()

    page.goto("http://localhost:3000/login")
    page.fill("input[name='email']", "test@test.com")
    page.fill("input[name='password']", "password")
    page.click("button:text('Login')")
    page.wait_for_url("http://localhost:3000/dashboard")

    page.goto("http://localhost:3000/create-invoice")
    page.wait_for_url("http://localhost:3000/create-invoice")

    # Add a generic item
    page.select_option("select#itemType", "Generic Item")
    page.click("button:text('Add Item')")

    # Add a mobile phone
    page.select_option("select#itemType", "Mobile Phone")
    page.click("button:text('Add Item')")

    # Add a laptop
    page.select_option("select#itemType", "Laptop / Chromebook")
    page.click("button:text('Add Item')")

    # Add apparel
    page.select_option("select#itemType", "Apparel / Clothing")
    page.click("button:text('Add Item')")

    page.screenshot(path="jules-scratch/verification/verification.png")

    browser.close()

with sync_playwright() as playwright:
    run(playwright)
