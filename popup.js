document.getElementById('summarizeBtn').addEventListener('click', async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: () => {
      // Extract visible text from the page
      function getVisibleText() {
        function isVisible(node) {
          return !!( node.offsetWidth || node.offsetHeight || node.getClientRects().length );
        }
        let walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null, false);
        let text = '';
        let node;
        while (node = walker.nextNode()) {
          if (isVisible(node.parentElement)) {
            text += node.textContent + ' ';
          }
        }
        return text.replace(/\s+/g, ' ').trim();
      }
      return getVisibleText();
    },
  }, async (results) => {
    const pageText = results[0]?.result || '';
    let summary = '';
    if (pageText) {
      try {
        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer YOUR_OPENROUTER_API_KEY'
          },
          body: JSON.stringify({
            model: "google/gemini-2.0-flash-exp:free",
            messages: [
              { role: "system", content: "You are a helpful assistant that summarizes web pages." },
              { role: "user", content: "Summarize the following text:\n\n" + pageText }
            ],
            max_tokens: 256
          })
        });
        if (response.ok) {
          const data = await response.json();
          summary = data.choices?.[0]?.message?.content || 'No summary returned.';
        } else {
          summary = 'Failed to get summary from OpenRouter.';
        }
      } catch (error) {
        summary = 'Error contacting OpenRouter API.';
      }
    } else {
      summary = 'No readable content found.';
    }
    document.getElementById('summary').textContent = summary;
  });
});