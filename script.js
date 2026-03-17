// 1. Set Google Script URL
const scriptURL = 'https://script.google.com/macros/s/AKfycbxIG9p1TjbMx8uG6jRFY9pr1CSMzpD3KRjICzBx4PWb3n2NfGVBuHoTIwzF0o0TeMuo/exec';

// 2. Prevent choosing past dates
const datePicker = document.getElementById('appDate');
if(datePicker) {
    const today = new Date().toISOString().split('T')[0];
    datePicker.setAttribute('min', today);
}

// 3. Handle Form Submission
const form = document.getElementById('appointmentForm');

form.addEventListener('submit', e => {
    e.preventDefault(); // Stop form from refreshing the page

    // --- NEW: Phone Number Validation (Major Project Requirement) ---
    const phoneInput = document.getElementById('phone');
    if (phoneInput && phoneInput.value.length !== 10) {
        alert("⚠️ Invalid Phone Number: Please enter exactly 10 digits.");
        phoneInput.focus();
        return; // Stop the code here if phone is wrong
    }

    // Generate Unique Appointment ID
    const randomID = "CF-" + Math.floor(1000 + Math.random() * 9000);

    // Prepare Form Data to send
    const formData = new FormData(form);
    formData.append('AppointmentID', randomID); 

    // Visual Feedback: Show "Processing..."
    const btn = document.getElementById('submitBtn');
    btn.innerText = "Processing...";
    btn.disabled = true;

    // Send data to Google Sheets
    fetch(scriptURL, { method: 'POST', body: formData })
        .then(response => {
            // A. Update the Receipt details on the screen
            document.getElementById('displayID').innerText = randomID;
            document.getElementById('receiptName').innerText = "Patient: " + document.getElementById('userName').value;
            document.getElementById('receiptDateTime').innerText = 
                "Slot: " + document.getElementById('appDate').value + " at " + document.getElementById('appTime').value;

            // B. Hide form and show success message
            form.classList.add('hidden');
            document.getElementById('successMessage').classList.remove('hidden');
        })
        .catch(error => {
            console.error('Error!', error.message);
            alert("Oops! Something went wrong. Please try again.");
            btn.innerText = "Request Appointment";
            btn.disabled = false;
        });
});

// --- NEW: Geolocation Logic (Major Project Requirement) ---
// This part handles the "Find Hospitals Near Me" button
const locBtn = document.getElementById('find-location-btn');
const locStatus = document.getElementById('location-status');

if (locBtn) {
    locBtn.addEventListener('click', () => {
        if (!navigator.geolocation) {
            locStatus.textContent = "Geolocation is not supported by your browser.";
            return;
        }

        locStatus.textContent = "Searching for your location...";

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;
                
                locStatus.innerHTML = `✅ Location Found! <br> <small>Lat: ${lat.toFixed(2)}, Lon: ${lon.toFixed(2)}</small>`;
                
                // For your Major Project, we will later use these coordinates 
                // to auto-filter the hospital dropdown list!
                console.log("User Location:", lat, lon);
            },
            () => {
                locStatus.textContent = "❌ Unable to retrieve location. Please check your browser permissions.";
            }
        );
    });
}
