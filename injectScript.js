// This is a simple standalone script that will be injected directly from our manifest
// It creates a button without any React dependencies

console.log("Web Page Summarizer direct injection script running");

function markdownToHtml(markdown) {
    // Convert markdown to HTML using a simple regex (for demonstration purposes)
    // In a real-world scenario, you might want to use a library like marked.js or showdown.js
    return markdown
        .replace(/#/g, '<p>')
        .replace(/##/g, '<p>')
        .replace(/###/g, '<p>')
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/\n/g, '<br>');
}

function createSummarizerButton() {
    // Create a button element
    const button = document.createElement('button');

    // Set properties
    button.textContent = "Summarize";
    button.id = "injected-summarize-button";

    // Set styles directly
    Object.assign(button.style, {
        position: 'fixed',
        right: '0px',
        bottom: '300px',
        backgroundColor: '#007bff',
        color: 'white',
        padding: '4px 8px',
        fontSize: '8px',
        fontWeight: 'bold',
        borderRadius: '4px 0 0 4px',
        cursor: 'pointer',
        zIndex: '2147483647',
        fontFamily: 'Arial, sans-serif',
    });

    // Add click event
    button.addEventListener('click', function () {
        console.log("Injected summarizer button clicked");

        // Get page text
        const textContent = document.body.innerText || document.body.textContent || '';

        fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": "Bearer <YOUR_OPENROUTER_API_KEY>",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "model": "meta-llama/llama-4-scout:free",
                "messages": [
                    {
                        "role": "user",
                        "content": [
                            {
                                "type": "text",
                                "text": "Summarize the following article in a few sentences, use bullets where necessary, organize the summary in sections like the original article. " + textContent
                            }
                        ]
                    }
                ]
            })
        }).then(response => {
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            return response.json();
        }).then(data => {
            console.log("Response data:", data);
            // Check if the response contains a summary
            if (data && data.choices && data.choices.length > 0) {
                const summary = data.choices[0].message.content;
                console.log("Summary received:", markdownToHtml(summary));
                showSummaryModal(markdownToHtml(summary));
            } else {
                throw new Error("No summary found in the response");
            }
        }
        ).catch(error => {
            console.error("Error fetching summary:", error);
            // Show an error message in the modal
            const errorMessage = "Error fetching summary: " + error.message;
            showSummaryModal(errorMessage);
        }
        );

        // Create a modal for the summary
    });

    // Add to the document
    document.body.appendChild(button);
    console.log("Injected button added to page");
}

function showSummaryModal(summary) {
    // Create modal elements
    const backdrop = document.createElement('div');
    const modal = document.createElement('div');
    const closeBtn = document.createElement('button');
    const title = document.createElement('h2');
    const content = document.createElement('div');

    // Set backdrop styles
    Object.assign(backdrop.style, {
        position: 'fixed',
        top: '0',
        left: '0',
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        zIndex: '2147483647'
    });

    // Set modal styles
    Object.assign(modal.style, {
        position: 'relative',
        backgroundColor: 'white',
        marginTop: '50px',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        maxWidth: '600px',
        width: '90%',
        maxHeight: '80vh',
        overflowY: 'auto'
    });

    // Set close button styles
    Object.assign(closeBtn.style, {
        position: 'absolute',
        top: '10px',
        right: '10px',
        background: 'none',
        border: 'none',
        fontSize: '24px',
        cursor: 'pointer',
        padding: '0',
        width: '30px',
        height: '30px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#666'
    });

    // Set title styles
    Object.assign(title.style, {
        marginTop: '0',
        color: '#333',
        borderBottom: '1px solid #eee',
        paddingBottom: '10px'
    });

    // Set content styles
    Object.assign(content.style, {
        lineHeight: '1.5',
        color: '#444'
    });

    // Set content
    closeBtn.textContent = '×';
    title.textContent = 'Page Summary';
    content.innerHTML = summary || 'No summary available.';

    // Add close functionality
    closeBtn.addEventListener('click', function () {
        document.body.removeChild(backdrop);
    });

    backdrop.addEventListener('click', function (e) {
        if (e.target === backdrop) {
            document.body.removeChild(backdrop);
        }
    });

    // Assemble the modal
    modal.appendChild(closeBtn);
    modal.appendChild(title);
    modal.appendChild(content);
    backdrop.appendChild(modal);

    // Add to document
    document.body.appendChild(backdrop);
}

// Run when the DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', createSummarizerButton);
} else {
    createSummarizerButton();
}

// Also try on load
window.addEventListener('load', function () {
    // Check if the button was already created
    if (!document.getElementById('injected-summarize-button')) {
        createSummarizerButton();
    }
});

// Try one more time after a delay
setTimeout(function () {
    if (!document.getElementById('injected-summarize-button')) {
        createSummarizerButton();
    }
}, 2000);
