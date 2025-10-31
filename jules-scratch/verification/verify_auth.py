from playwright.sync_api import sync_playwright, expect
import time

def run(playwright):
    browser = playwright.chromium.launch()
    page = browser.new_page()

    page.goto("http://localhost:3000/")

    # Wait for the initial authentication check to complete by waiting for "Loading..." to disappear
    expect(page.get_by_text("Loading...")).to_be_hidden(timeout=10000)

    # Now that loading is done, check if we're on the dashboard or login page
    is_on_dashboard = "login" not in page.url

    if is_on_dashboard:
        # If on the dashboard, it means a user was already logged in.
        # We need to log out to test the login flow.
        page.get_by_role("button", name="Logout").click()
        # Confirm we are on the login page after logout
        expect(page).to_have_url("http://localhost:3000/login")
    else:
        # We are on the login page as expected
        expect(page).to_have_url("http://localhost:3000/login")

    # Take a screenshot of the login page
    page.screenshot(path="jules-scratch/verification/login_page.png")

    # Generate a unique email for each run to ensure a fresh sign-up
    unique_email = f"test-{int(time.time())}@example.com"

    # Sign up a new user
    page.get_by_placeholder("Email").fill(unique_email)
    page.get_by_placeholder("Password").fill("password")
    page.get_by_role("button", name="Sign Up").click()

    # Expect to be redirected to the dashboard and see the welcome message
    expect(page).to_have_url("http://localhost:3000/")
    expect(page.get_by_role("heading", name="Welcome to Invoice Pro")).to_be_visible()

    # Take a screenshot of the dashboard
    page.screenshot(path="jules-scratch/verification/dashboard_page.png")

    browser.close()

with sync_playwright() as playwright:
    run(playwright)
