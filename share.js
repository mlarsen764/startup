document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('main#share form');
    
    form.addEventListener('submit', function(event) {
      event.preventDefault(); // Prevent the default form submission
      
      // Gather form data
      const formData = new FormData(form);
      const displayOption = formData.get('option');
      let username = 'Anonymous';
      
      if(displayOption === "display username") {
        // Only set the username if the user opted to display it
        username = localStorage.getItem('userName') || 'Anonymous';
      }
      
      const entryData = {
        topic: formData.get('topics'),
        scriptureReference: document.querySelector('.reference').value,
        scriptureDetails: document.querySelectorAll('textarea')[1].value,
        scriptureInsights: document.querySelectorAll('textarea')[2].value,
        displayOption: displayOption,
        username: username
      };
      
      // Placeholder for sending data to a server
      console.log('Entry to be submitted:', entryData);

      form.reset();
      
      alert('Entry submitted! (not really, but when connected to a database it will be!!)');
    });
  });