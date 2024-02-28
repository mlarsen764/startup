document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("login").addEventListener("keypress", function(event) {
        if (event.key === "Enter") {
            event.preventDefault();
            login();
        }
    });
});

function login() {
    const nameEl = document.querySelector("#name");
    localStorage.setItem("userName", nameEl.value);
    window.location.href = "discover.html";
  }
  