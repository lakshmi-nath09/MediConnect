// ==========================================
// 1. CONFIGURATION & SELECTORS
// ==========================================
const scriptURL = 'https://script.google.com/macros/s/AKfycbxIG9p1TjbMx8uG6jRFY9pr1CSMzpD3KRjICzBx4PWb3n2NfGVBuHoTIwzF0o0TeMuo/exec';

const form = document.getElementById('appointmentForm');
const datePicker = document.getElementById('appDate');
const locBtn = document.getElementById('find-location-btn');
const locStatus = document.getElementById('location-status');
const hospitalSelect = document.getElementById('hospital');
const nearbyGroup = document.getElementById('nearby-hospitals');

// ==========================================
// 2. DATE SAFETY (No past appointments)
// ==========================================
if(datePicker) {
    const today = new Date().toISOString().split('T')[0];
    datePicker.setAttribute('min', today);
}

// ==========================================
// 3. SMART GEOLOCATION & HOSPITAL LOGIC
// ==========================================
if (locBtn) {
    locBtn.addEventListener('click', () => {
        if (!navigator.geolocation) {
            locStatus.textContent = "Geolocation is not supported by your browser.";
            return;
        }

        locStatus.textContent = "Analyzing your area...";

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;
                
                // Success Feedback
                locStatus.innerHTML = `✅ Location Verified! <br> <small>Nearby hospitals identified.</small>`;
                
                // LOGIC: Injecting nearest hospitals into the dropdown
                // In a real project, this simulates a radius search result
                nearbyGroup.innerHTML = `
                    <option value="City Central Hospital" selected>🌟 City Central Hospital (0.8km away)</option>
                    <option value="Metro Health Hub">📍 Metro Health Hub (2.1km away)</option>
                `;
                
                // Automatically set the dropdown to the closest option
                hospitalSelect.value = "City Central Hospital";
                
                console.log("Coordinates Acquired:", lat, lon);
            },
            () => {
                locStatus.textContent = "❌ Error: Please allow location permissions.";
            }
        );
    });
}

// ==========================================
// 4. FORM SUBMISSION & VALIDATION
// ==========================================
form.addEventListener('submit', e => {
    e.preventDefault(); 

    // --- Phone Validation ---
    const phoneInput = document.getElementById('phone');
    const countryCode = document.getElementById('country-code').value;
    
    if (phoneInput && phoneInput.value.length !== 10) {
        alert("⚠️ Please enter exactly 10 digits for the phone number.");
        phoneInput.focus();
        return; 
    }

    // Combine Country Code + Number for the database
    const fullContact = `${countryCode} ${phoneInput.value}`;

    // Generate Unique ID
    const randomID = "CF-" + Math.floor(1000 + Math.random() * 9000);

    // Prepare Data
    const formData = new FormData(form);
    formData.append('AppointmentID', randomID); 
    formData.set('Phone', fullContact); // Sends the full international number

    // Visual Feedback
    const btn = document.getElementById('submitBtn');
    const originalText = btn.innerText;
    btn.innerText = "Processing...";
    btn.disabled = true;

    // Send to Google Sheets
    fetch(scriptURL, { method: 'POST', body: formData })
        .then(response => {
            // Update Receipt Details
            document.getElementById('displayID').innerText = randomID;
            document.getElementById('receiptName').innerText = "Patient: " + document.getElementById('userName').value;
            
            // NEW: Adding Hospital Name to the Receipt
            const selectedHospital = hospitalSelect.options[hospitalSelect.selectedIndex].text;
            document.getElementById('receiptDateTime').innerText = 
                `At: ${selectedHospital} | ${document.getElementById('appDate').value}`;

            // Hide Form, Show Success
            form.classList.add('hidden');
            document.getElementById('successMessage').classList.remove('hidden');
        })
        .catch(error => {
            console.error('Submission Error!', error.message);
            alert("Connection error. Please try again.");
            btn.innerText = originalText;
            btn.disabled = false;
        });
});
