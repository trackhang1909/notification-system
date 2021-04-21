// Register
const registerForm = document.getElementById('register-form');
registerForm.addEventListener('submit', registerUser);

function registerUser (event) {
    event.preventDefault();
    const alertError = document.getElementById('alert-error-register');
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            username,
            email,
            password
        })
    };
    if (password !== confirmPassword) {
        alertError.style.display = 'block';
        alertError.innerText = 'Mật khẩu xác nhận không hợp lệ';
    }
    else {
        fetch('/register', options)
        .then(res => res.json())
        .then(data => {
            if (data.error === 'true') {
                alertError.style.display = 'block';
                alertError.innerText = data.message;
            }
            else {
                window.location = '/login?username=' + data.username;
            }
        });
    }
}