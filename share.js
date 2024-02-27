document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('main#share form');
    
    form.addEventListener('submit', function(event) {
      event.preventDefault(); // Prevent the default form submission
      
      // Gather form data
      const formData = new FormData(form);
      const entryData = {
        topic: formData.get('topics'),
        scriptureReference: document.querySelector('.reference').value,
        scriptureDetails: document.querySelectorAll('textarea')[1].value,
        scriptureInsights: document.querySelectorAll('textarea')[2].value,
        displayOption: formData.get('option'),
        username: localStorage.getItem('userName') || 'Anonymous'
      };
      
      // Placeholder for sending data to a server
      console.log('Entry to be submitted:', entryData);
      
      alert('Entry submitted! (not really, but when connected to a database it will!)');
    });
  });