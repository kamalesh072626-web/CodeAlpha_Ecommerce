// Target the signup form
const signupForm = document.getElementById('signup-form');

// Only run this code if we are actually on the signup page
if (signupForm) {
    signupForm.addEventListener('submit', async (e) => {
        e.preventDefault(); // Prevents the default browser refresh

        // 1. Grab the values the user typed in
        const name = document.getElementById('signup-name').value;
        const email = document.getElementById('signup-email').value;
        const password = document.getElementById('signup-password').value;

        try {
            // 2. Send the data to your Node.js backend
            const response = await fetch('http://localhost:5000/api/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name, email, password })
            });

            const data = await response.json();

            // 3. Handle the server's response
            if (response.ok) {
                alert("Account created successfully! Let's get you logged in.");
                window.location.href = "login.html"; // Redirects them to the login page
            } else {
                // If the user already exists or there is an error
                alert("Error: " + data.message);
            }
        } catch (error) {
            console.error("Signup failed:", error);
            alert("Could not connect to the server. Make sure your backend is running!");
        }
    });
}

// Target the login form
const loginForm = document.getElementById('login-form');

// Only run this code if we are actually on the login page
if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault(); 

        // 1. Grab the values the user typed in
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;

        try {
            // 2. Send the data to your Node.js backend
            const response = await fetch('http://localhost:5000/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            // 3. Handle the server's response
            if (response.ok) {
                alert("Welcome back!");
                window.location.href = "index.html"; // Redirects them to the home page
            } else {
                // If they typed the wrong password or email
                alert("Error: " + data.message);
            }
        } catch (error) {
            console.error("Login failed:", error);
            alert("Could not connect to the server.");
        }
    });
}
