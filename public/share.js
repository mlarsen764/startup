document.addEventListener('DOMContentLoaded', function() {
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
      .then(response => response.json())
      .then(data => {
        console.log('Success:', data);
        alert('Entry submitted successfully!');
        form.reset();
      })
      .catch((error) => {
        console.error('Error: ', error);
        alert('Error submitting entry.');
      });

      
    });
  });