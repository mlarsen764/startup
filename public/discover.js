document.addEventListener("DOMContentLoaded", function() {
  
  const shareLink = document.getElementById('shareLink');
    shareLink.addEventListener('click', async function(event) {
        event.preventDefault(); // Always prevent default first
        
        try {
            const response = await fetch(`/api/auth/check`);
            const data = await response.json();
            
            if (data.authenticated) {
                window.location.href = 'share.html'; // Redirect if authenticated
            } else {
                alert('Please log in to share content.'); // Show an alert before redirecting
                window.location.href = 'index.html'; // Redirect to login page if not authenticated
            }
        } catch (error) {
            console.error('Authentication check failed:', error);
            // Handle error (maybe redirect to an error page or display a message)
        }
    });
  
  var collapsibleHeaders = document.querySelectorAll('.collapsible-header');
  collapsibleHeaders.forEach(function(header) {
    // Click to expand collapsible header
    header.addEventListener('click', function() {
      this.classList.toggle('active');
      var content = this.nextElementSibling;
      if (content.style.maxHeight) {
          content.style.maxHeight = null;
      } else {
          content.style.maxHeight = content.scrollHeight + "px";
      }
    });
  });
  function getUserName() {
    return localStorage.getItem('userName') ?? 'Guest';
  }
  document.getElementById('userNameDisplay').textContent = getUserName();

  // Fetch entries
  fetch('/api/entries')
    .then(response => response.json())
    .then(entries => {
      displayEntries(entries);
    })
    .catch(error => console.error('Error fetching entries: ', error));
});

function displayEntries(entries) {
  entries.forEach(entry => {
    const topicId = `content-${entry.topic.replace(/\s+/g, '_')}`;
    const topicElement = document.getElementById(topicId);
    if (topicElement) {
      const entryElement = document.createElement('div');
      entryElement.className = 'entry';
      entryElement.innerHTML = `
        <strong>Reference:</strong> ${entry.reference} <span class="entry-separator">-</span> 
        <strong>Author:</strong> ${entry.anonymous ? 'Anonymous' : entry.author}<br>
        <strong>Scripture:</strong> ${entry.scripture}<br>
        <strong>Insights:</strong> ${entry.insights}<br>
        <button class="delete-entry-button" data-entry-id="${entry.id}">Delete Entry</button>
        <hr>
      `;
      topicElement.appendChild(entryElement);
    } 
  });
  const deleteButtons = document.querySelectorAll('.delete-entry-button');
  deleteButtons.forEach(button => {
    button.addEventListener('click', function() {
      const entryId = this.getAttribute('data-entry-id');
      deleteEntry(entryId);
    });
  });
}

function deleteEntry(entryId) {
  fetch(`/api/entries/${entryId}`, {
      method: 'DELETE',
  })
  .then(response => {
      if(response.ok) {
          alert('Entry deleted successfully!');
          location.reload()
      } else {
          alert('Error deleting entry.');
      }
  })
  .catch((error) => {
      console.error('Error:', error);
      alert('Error deleting entry.');
  });
}

