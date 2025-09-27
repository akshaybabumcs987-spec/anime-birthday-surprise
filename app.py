import streamlit as st
import streamlit.components.v1 as components
from pathlib import Path
import base64
import re

# Set Streamlit page configuration
st.set_page_config(
    page_title="Anime Birthday Surprise",
    layout="wide",
    initial_sidebar_state="collapsed"
)

def read_file(filepath):
    """Reads a file and returns its content."""
    with open(filepath, "r", encoding="utf-8") as f:
        return f.read()

def get_image_type(filename):
    """Determines the MIME type based on the file extension."""
    if filename.endswith(".png"):
        return "image/png"
    elif filename.endswith(".jpg") or filename.endswith(".jpeg"):
        return "image/jpeg"
    elif filename.endswith(".gif"):
        return "image/gif"
    elif filename.endswith(".svg"):
        return "image/svg+xml"
    else:
        return "application/octet-stream"

def image_to_base64(filepath):
    """Converts an image file to a Base64 string."""
    try:
        with open(filepath, "rb") as img_file:
            encoded_string = base64.b64encode(img_file.read()).decode()
        mime_type = get_image_type(filepath.name)
        return f"data:{mime_type};base64,{encoded_string}"
    except FileNotFoundError:
        return None

def bundle_site():
    """Reads HTML, CSS, JS, and images and bundles them into a single HTML string."""
    base_path = Path(__file__).parent / "static"
    
    # 1. Read HTML, CSS, and JS
    html_content = read_file(base_path / "index.html")
    css_content = read_file(base_path / "style.css")
    js_content = read_file(base_path / "script.js")
    
    # 2. Inject CSS and JS into the HTML
    # Replace <link> with <style>...</style>
    html_content = html_content.replace(
        '<link rel="stylesheet" href="style.css">', 
        f'<style>{css_content}</style>'
    )
    # Replace <script> with <script>...</script>
    html_content = html_content.replace(
        '<script src="script.js"></script>',
        f'<script>{js_content}</script>'
    )
    
    # 3. Find all image references and replace them with Base64 strings
    # Regex to find src="images/..." in <img> tags and data-funny="images/..." attributes
    image_pattern = r'(src|data-funny)="images/([^"]+)"'
    
    def replace_image_path(match):
        attribute = match.group(1) # 'src' or 'data-funny'
        image_name = match.group(2)
        image_path = base_path / "images" / image_name
        base64_string = image_to_base64(image_path)
        
        if base64_string:
            return f'{attribute}="{base64_string}"'
        else:
            # If image is not found, keep original path but maybe log a warning
            st.warning(f"Image not found: {image_path}. Using original path.")
            return match.group(0) # Return the original string

    html_content = re.sub(image_pattern, replace_image_path, html_content)
    
    return html_content

# --- Main App ---
st.title("Anime Birthday Surprise Host")
st.write("Your interactive website is embedded below.")

# Bundle and display the website
final_html = bundle_site()
components.html(final_html, height=1000, scrolling=True)