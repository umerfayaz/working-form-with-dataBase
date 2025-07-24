import { initializeApp } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDsfniZlO-kvQHj6z0rP7AaPg65DwQhPA4",
  authDomain: "saylani-form-d4c4b.firebaseapp.com",
  projectId: "saylani-form-d4c4b",
  storageBucket: "saylani-form-d4c4b.firebasestorage.app",
  messagingSenderId: "869466337904",
  appId: "1:869466337904:web:693ede46fa372f8dcf7ab5"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

document.addEventListener("DOMContentLoaded", function () {
  const regForm = document.getElementById("registration-form");
  const idForm = document.getElementById("id-form");
  const resultsForm = document.getElementById("results-form");
  const submittedDataSection = document.getElementById("submittedData");

  const btnReg = document.getElementById("btn-registration");
  const btnId = document.getElementById("btn-idcard");
  const btnResults = document.getElementById("btn-results");

  function showForm(show, ...hide) {
    if (show) show.style.display = "block";
    hide.forEach((form) => {
      if (form) form.style.display = "none";
    });
  }

  showForm(regForm, idForm, resultsForm);

  if (btnReg) {
    btnReg.addEventListener("click", () => {
      showForm(regForm, idForm, resultsForm);
    });
  }

  if (btnId) {
    btnId.addEventListener("click", () => {
      showForm(idForm, regForm, resultsForm);
    });
  }

  if (btnResults) {
    btnResults.addEventListener("click", () => {
      showForm(resultsForm, regForm, idForm);
    });
  }

  // ✅ Go Back Button (only added once)
  document.getElementById("goBackBtn").addEventListener("click", function () {
    submittedDataSection.classList.remove("fade-in");
    submittedDataSection.classList.add("fade-out");

    setTimeout(() => {
      submittedDataSection.style.display = "none";
      regForm.style.display = "block";
      regForm.classList.add("fade-in");
    }, 500);

    regForm.reset();
  });

  // ✅ Form Submit Handler
  regForm?.addEventListener("submit", async function (e) {
    e.preventDefault();

    const formData = {
      country: document.getElementById("country").value,
      city: document.getElementById("city").value,
      course: document.getElementById("course").value,
      proficiency: document.getElementById("proficiency").value,
      fullName: document.getElementById("fullName").value,
      fatherName: document.getElementById("fatherName").value,
      email: document.getElementById("email").value,
      phone: document.getElementById("phone").value,
      cnic: document.getElementById("cnic").value,
      fcnic: document.getElementById("fcnic").value,
      address: document.getElementById("Address").value,
      qualification: document.getElementById("Qualification").value,
    };

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.cnic + "123");
      const user = userCredential.user;

      await setDoc(doc(db, "students", user.uid), {
        uid: user.uid,
        ...formData,
        createdAt: new Date().toISOString()
      });

      // Generate PDF
      const { jsPDF } = window.jspdf;
      const pdf = new jsPDF();
      pdf.setFontSize(12);
      let y = 10;
      pdf.text(`Saylani Registration Form`, 10, y);
      for (const [key, value] of Object.entries(formData)) {
        y += 10;
        pdf.text(`${key.charAt(0).toUpperCase() + key.slice(1)}: ${value}`, 10, y);
      }
      pdf.save(`${formData.fullName.replaceAll(" ", "_")}_Registration.pdf`);

      // Show data
      for (const key in formData) {
        const el = document.getElementById("display" + key.charAt(0).toUpperCase() + key.slice(1));
        if (el) el.textContent = formData[key];
      }

      submittedDataSection.style.display = "block";
      submittedDataSection.classList.remove("fade-out");
      submittedDataSection.classList.add("fade-in");

      regForm.style.display = "none";
      alert("Registration successful!");
      regForm.reset();

    } catch (error) {
      console.error("Firebase Error:", error.message);
      alert("Error: " + error.message);
    }
  });
});
