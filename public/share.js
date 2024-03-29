document.addEventListener('DOMContentLoaded', function() {
    configureWebSocket()
    const form = document.querySelector('main#share form');
    
    form.addEventListener('submit', function(event) {
      event.preventDefault();
      
      // Gather form data
      const formData = new FormData(form);
      let username = 'Anonymous';
      
      if(formData.get('option') === "display username") {
        // Only set the username if the user opted to display it
        username = localStorage.getItem('userName') || 'Anonymous';
      }
      
      const entryData = {
        topic: formData.get('topics'),
        reference: document.querySelector('.reference').value,
        scripture: document.querySelectorAll('textarea')[1].value,
        insights: document.querySelectorAll('textarea')[2].value,
        author: username,
        anonymous: formData.get('option') === "remain anonymous"
      };
      
      fetch('/api/entries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(entryData),
      })
      .then(response => {
        if (!response.ok) {
          // If the server response is not OK, throw an error to be caught by the catch block
          throw new Error('Network response was not ok.');
        }
        return response.json();
      })
      .then(data => {
        console.log('Success:', data);
        form.reset();
      })
      .catch((error) => {
        console.error('Error: ', error);
        alert('Error submitting entry.');
      });

      
    });
  });

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