document.addEventListener("DOMContentLoaded", async function() {
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

    await validateSessionAndUpdateUI();
});

async function validateSessionAndUpdateUI() {
    try {
        const response = await fetch(`/api/auth/check`);
        const data = await response.json();
        if (data.authenticated) {
            // User is authenticated
            document.getElementById('loginForm').style.display = 'none';
            document.getElementById('logoutForm').style.display = 'block';
        } else {
            // User is not authenticated
            localStorage.removeItem('userName');
            document.getElementById('loginForm').style.display = 'block';
            document.getElementById('logoutForm').style.display = 'none';
        }
    } catch (error) {
        console.error('Error validating session:', error);
    }
}

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

function discover() {
    window.location.href = 'discover.html';
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