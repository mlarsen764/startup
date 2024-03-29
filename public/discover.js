document.addEventListener("DOMContentLoaded", function() {
  configureWebSocket();
  fetchAndDisplayEntries();
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
});

function fetchAndDisplayEntries() {
  // Fetch entries
  fetch('/api/entries')
    .then(response => response.json())
    .then(entries => { // This 'entries' comes from the fetch call's response
      const currentUserName = localStorage.getItem('userName');
      entries.forEach(entry => {
        const topicId = `content-${entry.topic.replace(/\s+/g, '_')}`;
        const topicElement = document.getElementById(topicId);
        if (topicElement) {
          const entryElement = document.createElement('div');
          entryElement.className = 'entry';
          let entryHTML = `
            <strong>Reference:</strong> ${entry.reference} <span class="entry-separator">-</span> 
            <strong>Author:</strong> ${entry.anonymous ? 'Anonymous' : entry.author}<br>
            <strong>Scripture:</strong> ${entry.scripture}<br>
            <strong>Insights:</strong> ${entry.insights}<br>
          `;

          if (currentUserName === 'mlarsen64') {
            entryHTML += `<button class="delete-entry-button" data-entry-id="${entry._id}">Delete Entry</button>`;
          }

          entryHTML += `<hr>`;
          entryElement.innerHTML = entryHTML;
          topicElement.appendChild(entryElement);
        }
      });
      attachDeleteEntryEventListeners(); // Separated logic for attaching event listeners
    })
    .catch(error => console.error('Error fetching entries: ', error));
}

function attachDeleteEntryEventListeners() {
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

function configureWebSocket() {
  const protocol = window.location.protocol === 'http:' ? 'ws' : 'wss';
  const socket = new WebSocket(`${protocol}://${window.location.host}/ws`);
  socket.onopen = (event) => {
    console.log('Connected to WebSocket server');
  };
  socket.onmessage = (event) => {
    const data = JSON.parse(event.data);
    // Check if the action of the received message is 'newEntry'
    if (data.action === 'newEntry') {
      const notification = document.getElementById('notification');
      notification.textContent = `${data.data}`;
      notification.classList.remove('hidden');

      setTimeout(() => {
        notification.classList.add('hidden')
      }, 4000);
    }
  };
  socket.onclose = (event) => {
    console.log('Disconnected from WebSocket server');
  };
}