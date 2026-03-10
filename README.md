# 🏥 MediConnect - Smart Hospital Appointment System

**MediConnect** is a modern, responsive web application designed to streamline patient registration and appointment management.

---

## 🚀 Live Demo
Check out the live site here: [INSERT YOUR GITHUB PAGES LINK HERE]

---

## ✨ Key Features
* **Unique Appointment ID:** Automatically generates a custom tracking ID (e.g., #CF-4582) for every booking.
* **Live Database Integration:** Uses **Google Apps Script** to log patient data directly into a Google Sheet in real-time.
* **Smart Date Picker:** Prevents patients from selecting past dates or weekends.
* **Printable Receipts:** A dedicated "Print Receipt" feature allows patients to save their booking details as a PDF.
* **Categorized Departments:** Organized dropdown menu featuring over 15 medical specialties.

---

## 🛠️ Technology Stack
* **Frontend:** HTML5, CSS3 (Flexbox/Grid), JavaScript (ES6+)
* **Backend:** Google Apps Script (Web App API)
* **Storage:** Google Sheets (as a Cloud Database)

---

## 📸 How it Works
1. **Patient Input:** User enters their details and selects a preferred department.
2. **Data Processing:** JavaScript validates the date and generates a unique ID.
3. **Synchronization:** Data is sent via `fetch()` to a Google Script URL.
4. **Confirmation:** The form disappears and a printable receipt is displayed for the user.

---

## 🛡️ Privacy & Security
MediConnect includes a privacy agreement checkbox to ensure users are aware of data processing, mimicking real-world healthcare compliance standards.

---

## 👨‍💻 Author
**[YOUR NAME]**
* GitHub: [@yourusername](https://github.com/yourusername)
