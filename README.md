# PageBrief

PageBrief is a Google Chrome extension that provides concise summaries of web pages, helping users quickly grasp the main points without reading the entire content.

## Features

- Summarizes the main content of any web page with a single click
- Clean and user-friendly interface
- Lightweight and fast
- Privacy-focused: processes data locally (if applicable)

## Installation

1. Download or clone this repository.
2. Open Google Chrome and navigate to `chrome://extensions/`.
3. Enable "Developer mode" (toggle in the top right).
4. Click "Load unpacked" and select the project directory.
5. The PageBrief icon should appear in your Chrome toolbar.

**Important:**  
Before using the extension, you must replace all instances of `YOUR_OPENROUTER_API_KEY` in the source code with your actual OpenRouter API key.  
This is required for the extension to function properly.

## Usage

1. Navigate to any web page you want to summarize.
2. Click the PageBrief extension icon in the Chrome toolbar.
3. View the summary generated for the current page.

## Development

To contribute or modify the extension:

1. Clone the repository:
    ```bash
    git clone https://github.com/astrod333/PageBrief.git
    ```
2. Make your changes in the source files.
3. Reload the extension in Chrome (`chrome://extensions/`) after making changes.

### Project Structure

- `manifest.json` - Chrome extension manifest
- `background.js` - Background script
- `injectScript.js` - Script injected into web pages
- `icon16.png`, `icon48.png`, `icon128.png` - Extension icons

## License

This project is licensed under the terms of the MIT License. See the [LICENSE](LICENSE) file for details.
