document.addEventListener("DOMContentLoaded", function(event) {
});

// Register
const registerForm = document.getElementById('register-form');
if (registerForm !== null) registerForm.addEventListener('submit', registerUser);

function registerUser (event) {
    event.preventDefault();
    const alertError = document.getElementById('alert-error-register');
    const alertSuccess = document.getElementById('alert-success-register');
    const fullname = document.getElementById('fullname').value;
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    const role = document.getElementById('role').value;
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            fullname,
            username,
            email,
            password,
            role
        })
    };
    if (password !== confirmPassword) {
        alertSuccess.style.display = 'none';
        alertError.style.display = 'block';
        alertError.innerText = 'Mật khẩu xác nhận không hợp lệ';
    }
    else {
        fetch('/register', options)
        .then(res => res.json())
        .then(data => {
            if (data.error === 'true') {
                alertSuccess.style.display = 'none';
                alertError.style.display = 'block';
                alertError.innerText = data.message;
            }
            else {
                alertError.style.display = 'none';
                alertSuccess.style.display = 'block';
                alertSuccess.innerText = data.message;
            }
        });
    }
}


