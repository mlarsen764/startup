document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("login").addEventListener("keypress", function(event) {
        if (event.key === "Enter") {
            event.preventDefault();
            login();
        }
    });

    fetch('https://api.quotable.io/random')
    .then(response => response.json())
    .then(data => {
        const quote = data.content;
        const author = data.author;
        document.getElementById('quote').innerHTML = `"${quote}" - ${author}`;
    })
    .catch(error => console.error('Error:', error));
});

function login() {
    const nameEl = document.getElementById("name");
    const passwordEl = document.getElementById("password")
    localStorage.setItem("userName", nameEl.value);
    window.location.href = "discover.html";
  }
  