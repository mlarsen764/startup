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

// function login() {
//     const nameEl = document.getElementById("name");
//     const passwordEl = document.getElementById("password")
//     localStorage.setItem("userName", nameEl.value);
//     window.location.href = "discover.html";
//   }

async function loginUser() {
    loginOrCreate(`/api/auth/login`);
}
  
async function createUser() {
    loginOrCreate(`/api/auth/create`);
}
  
async function loginOrCreate(endpoint) {
    const userName = document.querySelector('#userName')?.value;
    const password = document.querySelector('#userPassword')?.value;
    const response = await fetch(endpoint, {
        method: 'post',
        body: JSON.stringify({ email: userName, password: password }),
        headers: {
            'Content-type': 'application/json; charset=UTF-8',
        },
    });
  
    if (response.ok) {
        localStorage.setItem('userName', userName);
        window.location.href = 'discover.html';
    } else {
        const body = await response.json();
        const modalEl = document.querySelector('#msgModal');
        modalEl.querySelector('.modal-body').textContent = `⚠ Error: ${body.msg}`;
        const msgModal = new bootstrap.Modal(modalEl, {});
        msgModal.show();
    }
}
  
function share() {
    window.location.href = 'share.html';
}
  
function logout() {
    localStorage.removeItem('userName');
    fetch(`/api/auth/logout`, {
      method: 'delete',
    }).then(() => (window.location.href = '/'));
}
  
async function getUser(email) {
    // See if we have a user with the given email.
    const response = await fetch(`/api/user/${email}`);
    if (response.status === 200) {
        return response.json();
    }
    return null;
}
  
function setDisplay(controlId, display) {
    const shareControlEl = document.querySelector(`#${controlId}`);
    if (shareControlEl) {
      shareControlEl.style.display = display;
    }
}
  