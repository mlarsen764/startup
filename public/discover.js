document.addEventListener("DOMContentLoaded", function() {
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

  function displayEntries(entries) {
    entries.forEach(entry => {
      const topicId = `content-${entry.topic.replace(/\s+/g, '_')}`;
      const topicElement = document.getElementById(topicId);
      if (topicElement) {
        const entryElement = document.createElement('div');
        entryElement.className = 'entry';
        entryElement.innerHTML = `
          <strong>Reference:</strong> ${entry.reference}<br>
          <strong>Details:</strong> ${entry.details}<br>
          <strong>Insights:</strong> ${entry.insights}<br>
          <strong>Author:</strong> ${entry.anonymous ? 'Anonymous' : entry.author}<br>
          <hr>
        `;
        topicElement.appendChild(entryElement);
      } 
    });
  }




//   // Hypothetical function to update the page with a new entry
//   function addEntry(data) {
//     // Assuming `data` contains topic, reference, details, insights, and optionally username
//     const { topic, reference, details, insights, username } = data;

//     // Find the corresponding topic section
//     const topicSection = document.querySelector(`.collapsible-header[data-topic="${topic}"]`);
//     if (topicSection) {
//       let contentSection = topicSection.nextElementSibling;
//       if (contentSection && contentSection.classList.contains('collapsible-content')) {
//         // Create a new list item or div to hold the submission
//         const entryElement = document.createElement('li');
//         entryElement.textContent = `${reference} - ${details} (${username || 'Anonymous'}) - ${insights}`;
//         if (!contentSection.querySelector('ul')) {
//           // If there's no list, create one
//           const newList = document.createElement('ul');
//           contentSection.appendChild(newList);
//           contentSection = newList; // Update reference to insert correctly
//         }
//         contentSection.appendChild(entryElement);
//       }
//     }
//   }
});

