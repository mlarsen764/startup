document.addEventListener("DOMContentLoaded", function() {
  var collapsibleHeaders = document.querySelectorAll('.collapsible-header');
  collapsibleHeaders.forEach(function(header) {
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

