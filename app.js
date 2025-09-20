// Paste your Firebase configuration object here
const firebaseConfig = {
apiKey: "AIzaSyB59el3K_qrD1uvq1OUZB5X0_ER6mpHjf4",
authDomain: "chalodrives-rentals.firebaseapp.com",
projectId: "chalodrives-rentals",
storageBucket: "chalodrives-rentals.firebasestorage.app",
messagingSenderId: "876753426746",
appId: "1:876753426746:web:c2f2ab4784be85cf815803",
measurementId: "G-MCWVD5HTR8"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

// Set up the reCAPTCHA verifier
window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container', {
    'size': 'invisible',
    'callback': (response) => {
        // reCAPTCHA solved, allow signInWithPhoneNumber.
        // This callback is not strictly necessary for invisible reCAPTCHA.
    }
});


// Function to send OTP
function sendOtp() {
    const phoneNumber = document.getElementById('phone-number-input').value;
    const appVerifier = window.recaptchaVerifier;
    const status = document.getElementById('status');

    auth.signInWithPhoneNumber(phoneNumber, appVerifier)
        .then((confirmationResult) => {
            // SMS sent. Prompt user to type the code from the message.
            status.textContent = "OTP sent successfully!";
            window.confirmationResult = confirmationResult;
            
            // Show OTP section and hide phone number section
            document.getElementById('phone-section').style.display = 'none';
            document.getElementById('otp-section').style.display = 'block';

        }).catch((error) => {
            // Error; SMS not sent
            status.textContent = `Error: ${error.message}`;
            console.error("Error during signInWithPhoneNumber", error);
            // Reset reCAPTCHA so user can try again
            window.recaptchaVerifier.render().then(function(widgetId) {
                grecaptcha.reset(widgetId);
            });
        });
}

// Function to verify OTP
function verifyOtp() {
    const otp = document.getElementById('otp-input').value;
    const status = document.getElementById('status');

    if (!window.confirmationResult) {
        status.textContent = "Please send an OTP first.";
        return;
    }

    window.confirmationResult.confirm(otp).then((result) => {
        // User signed in successfully.
        const user = result.user;
        status.textContent = "✅ Success! Phone number verified.";
        console.log("User verified:", user);
        // You can now redirect the user or perform other actions.
        
    }).catch((error) => {
        // User couldn't sign in (bad verification code?)
        status.textContent = `Error: Invalid OTP. Please try again.`;
        console.error("Error during OTP verification", error);
    });
}