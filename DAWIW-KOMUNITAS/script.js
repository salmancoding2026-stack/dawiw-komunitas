// --- 1. IMPORT FIREBASE (Versi 12) ---
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.12.1/firebase-app.js";
import { getDatabase, ref, push, set } from "https://www.gstatic.com/firebasejs/12.12.1/firebase-database.js";

// --- 2. KONFIGURASI FIREBASE ---
const firebaseConfig = {
  apiKey: "AIzaSyDIMbyLwzY669sKVI0lmRAlPX8ekm6610M",
  authDomain: "prokanban-app.firebaseapp.com",
  databaseURL: "https://prokanban-app-default-rtdb.asia-southeast1.firebasedatabase.app", // URL Server Singapura
  projectId: "prokanban-app",
  storageBucket: "prokanban-app.firebasestorage.app",
  messagingSenderId: "82856627323",
  appId: "1:82856627323:web:554bd3c15480d9a40226de"
};

// Inisialisasi Firebase & Realtime Database
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// --- 3. UI & NAVIGASI ---
const navSlide = () => {
    const burger = document.querySelector('.burger');
    const nav = document.querySelector('.nav-links');
    burger.addEventListener('click', () => {
        nav.classList.toggle('nav-active');
        burger.classList.toggle('toggle');
    });
}
navSlide();

// --- 4. FITUR DARK MODE ---
const darkModeToggle = document.getElementById('darkModeToggle');
const body = document.body;

if (localStorage.getItem('theme') === 'dark') {
    body.classList.add('dark-theme');
    darkModeToggle.textContent = '☀️';
}

if(darkModeToggle) {
    darkModeToggle.addEventListener('click', () => {
        body.classList.toggle('dark-theme');
        const isDark = body.classList.contains('dark-theme');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
        darkModeToggle.textContent = isDark ? '☀️' : '🌙';
    });
}

// --- 5. INTEGRASI FORM KE FIREBASE & WHATSAPP ---
const contactForm = document.getElementById('contactForm');
const submitBtn = document.querySelector('.btn-submit');

if(contactForm) {
    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault(); 

        submitBtn.textContent = 'Memproses...';
        submitBtn.disabled = true;

        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const minat = document.getElementById('minat').value;
        const message = document.getElementById('message').value;

        try {
            // A. SIMPAN DATA KE FIREBASE REALTIME DATABASE
            const pendaftarRef = ref(db, 'pendaftar_dawiw');
            const dataBaruRef = push(pendaftarRef); 
            
            await set(dataBaruRef, {
                nama: name,
                email: email,
                minat: minat,
                pesan: message,
                tanggal: new Date().toISOString()
            });

            // B. NOTIFIKASI KE WHATSAPP ADMIN
            const nomorWA = "6285714865867"; 
            const teksWA = `Halo Admin DAWIW,%0A%0AAda pendaftaran anggota baru (via Firebase):%0ANama: ${name}%0AEmail: ${email}%0AMinat: ${minat}%0APesan: ${message}`;
            const urlWA = `https://wa.me/${nomorWA}?text=${teksWA}`;

            alert(`Pendaftaran berhasil! Data ${name} telah tersimpan di Firebase DAWIW.`);
            contactForm.reset();
            window.open(urlWA, '_blank');

        } catch (error) {
            console.error("Firebase Error:", error);
            alert("Terjadi kesalahan saat menyimpan data ke Firebase.");
        } finally {
            submitBtn.textContent = 'Kirim Pendaftaran';
            submitBtn.disabled = false;
        }
    });
}

// --- 6. SCROLL ANIMATION ---
const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add('show-element');
    });
}, { threshold: 0.15 });

document.querySelectorAll('.hidden-element').forEach((el) => observer.observe(el));