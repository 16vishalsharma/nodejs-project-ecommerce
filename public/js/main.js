// Main JavaScript file

// Copy to clipboard functionality
function copyToClipboard(text) {
  navigator.clipboard.writeText(text).then(() => {
    alert('Copied to clipboard!');
  }).catch(err => {
    console.error('Failed to copy:', err);
  });
}

// Form validation
function validateUrl(url) {
  const pattern = /^https?:\/\/.+/;
  return pattern.test(url);
}

// URL shortener form submission
document.addEventListener('DOMContentLoaded', function() {
  const urlForm = document.getElementById('urlForm');
  if (urlForm) {
    urlForm.addEventListener('submit', async function(e) {
      e.preventDefault();
      
      const originalUrl = document.getElementById('originalUrl').value;
      const customCode = document.getElementById('customCode').value;
      const expiresInDays = document.getElementById('expiresInDays').value;
      
      if (!validateUrl(originalUrl)) {
        alert('Please enter a valid URL starting with http:// or https://');
        return;
      }
      
      try {
        const response = await fetch('/api/urls', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            originalUrl,
            customCode: customCode || undefined,
            expiresInDays: expiresInDays || undefined,
          }),
        });
        
        const data = await response.json();
        
        if (data.success) {
          // Show result
          const resultDiv = document.getElementById('urlResult');
          if (resultDiv) {
            resultDiv.innerHTML = `
              <div class="url-result">
                <h3>Short URL Created!</h3>
                <p><strong>Original URL:</strong> ${data.data.originalUrl}</p>
                <p><strong>Short URL:</strong> <span class="short-url">${data.data.shortUrl}</span></p>
                <button class="btn" onclick="copyToClipboard('${data.data.shortUrl}')">Copy Short URL</button>
              </div>
            `;
            resultDiv.style.display = 'block';
          }
          urlForm.reset();
        } else {
          alert('Error: ' + data.error);
        }
      } catch (error) {
        console.error('Error:', error);
        alert('An error occurred. Please try again.');
      }
    });
  }
});

