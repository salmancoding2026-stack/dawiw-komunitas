// --- 1. NAVIGASI MOBILE ---
const navSlide = () => {
    const burger = document.querySelector('.burger');
    const nav = document.querySelector('.nav-links');
    
    burger.addEventListener('click', () => {
        nav.classList.toggle('nav-active');
        burger.classList.toggle('toggle');
    });
}
navSlide();

// --- 2. FITUR DARK MODE ---
const darkModeToggle = document.getElementById('darkModeToggle');
const body = document.body;

if (localStorage.getItem('theme') === 'dark') {
    body.classList.add('dark-theme');
    darkModeToggle.textContent = '☀️';
}

if(darkModeToggle) {
    darkModeToggle.addEventListener('click', () => {
        body.classList.toggle('dark-theme');
        
        if (body.classList.contains('dark-theme')) {
            localStorage.setItem('theme', 'dark');
            darkModeToggle.textContent = '☀️';
        } else {
            localStorage.setItem('theme', 'light');
            darkModeToggle.textContent = '🌙';
        }
    });
}

// --- 3. INTEGRASI FORM KE GOOGLE SHEETS & WHATSAPP ---
const contactForm = document.getElementById('contactForm');
const submitBtn = document.querySelector('.btn-submit');

if(contactForm) {
    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault(); 

        submitBtn.textContent = 'Mengirim...';
        submitBtn.disabled = true;

        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const message = document.getElementById('message').value;

        try {
            // URL GOOGLE SCRIPT KAMU SUDAH TERPASANG DI SINI 👇
            const scriptURL = 'https://script.google.com/macros/s/AKfycbxiUj_cfbT4Xwd_v3pjaHnduuP1zWJBQV4qzAZFwQryC3PwuXLx9wbWTBRoCE3-EYu7/exec'; 
            
            const formData = new FormData();
            formData.append('nama', name);
            formData.append('email', email);
            formData.append('pesan', message);

            await fetch(scriptURL, { method: 'POST', body: formData });

            // JANGAN LUPA GANTI DENGAN NOMOR WA ASLI KAMU 👇
            const nomorWA = "6285714865867"; 
            const teksWA = `Halo Admin DAWIW,%0A%0AAda pesan baru dari website:%0ANama: ${name}%0AEmail: ${email}%0APesan: ${message}`;
            const urlWA = `https://wa.me/${nomorWA}?text=${teksWA}`;

            alert(`Terima kasih, ${name}! Pesan berhasil dikirim ke komunitas DAWIW.`);
            contactForm.reset();

            // Membuka WA
            window.open(urlWA, '_blank');

        } catch (error) {
            console.error("Terjadi kesalahan:", error);
            alert("Maaf, terjadi kesalahan. Pastikan koneksi internet lancar.");
        } finally {
            submitBtn.textContent = 'Kirim Pesan';
            submitBtn.disabled = false;
        }
    });
}

// --- 4. FITUR BARU: SCROLL ANIMATION ---
const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add('show-element');
        }
    });
}, {
    threshold: 0.15 // Animasi mulai saat 15% elemen terlihat
});

const hiddenElements = document.querySelectorAll('.hidden-element');
hiddenElements.forEach((el) => observer.observe(el));
