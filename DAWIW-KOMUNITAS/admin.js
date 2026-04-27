// --- 1. IMPORT FIREBASE SERVICES ---
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.12.1/firebase-app.js";
import { getDatabase, ref, get } from "https://www.gstatic.com/firebasejs/12.12.1/firebase-database.js";
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/12.12.1/firebase-auth.js";

// --- 2. KONFIGURASI FIREBASE ---
const firebaseConfig = {
    apiKey: "AIzaSyDIMbyLwzY669sKVI0lmRAlPX8ekm6610M",
    authDomain: "prokanban-app.firebaseapp.com",
    databaseURL: "https://prokanban-app-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "prokanban-app",
    storageBucket: "prokanban-app.firebasestorage.app",
    messagingSenderId: "82856627323",
    appId: "1:82856627323:web:554bd3c15480d9a40226de"
};

// Inisialisasi Firebase, Auth, & Database
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const db = getDatabase(app);

// --- 3. DOM ELEMENTS ---
const googleLoginBtn = document.getElementById('googleLoginBtn');
const logoutBtn = document.getElementById('logoutBtn');
const loginScreen = document.getElementById('loginScreen');
const dashboardScreen = document.getElementById('dashboardScreen');
const errorMsg = document.getElementById('loginError');
const adminEmailDisplay = document.getElementById('adminEmail');

// --- 4. PANTAU STATUS LOGIN (AUTH STATE) ---
// Fungsi ini otomatis mengecek apakah kamu sedang login atau tidak
onAuthStateChanged(auth, (user) => {
    if (user) {
        // Jika sudah login, tampilkan dashboard & ambil data
        loginScreen.style.display = 'none';
        dashboardScreen.style.display = 'block';
        adminEmailDisplay.textContent = user.email; // Tampilkan email admin
        fetchFirebaseData(); 
    } else {
        // Jika belum login/logout, kembalikan ke layar login
        loginScreen.style.display = 'flex';
        dashboardScreen.style.display = 'none';
        adminEmailDisplay.textContent = "";
    }
});

// --- 5. AKSI LOGIN & LOGOUT ---
googleLoginBtn.addEventListener('click', async () => {
    try {
        errorMsg.style.display = 'none';
        // Membuka pop-up pilihan akun Google
        await signInWithPopup(auth, provider); 
    } catch (error) {
        console.error("Gagal Login:", error);
        errorMsg.style.display = 'block';
    }
});

logoutBtn.addEventListener('click', () => {
    signOut(auth);
});

// --- 6. AMBIL DATA DARI DATABASE ---
async function fetchFirebaseData() {
    const tableBody = document.getElementById('memberTableBody');
    const totalMembersEl = document.getElementById('totalMembers');
    
    try {
        // Menggunakan get() dari SDK agar Auth-Token otomatis terkirim
        const dbRef = ref(db, 'pendaftar_dawiw');
        const snapshot = await get(dbRef);

        if (!snapshot.exists()) {
            tableBody.innerHTML = '<tr><td colspan="5" style="text-align: center;">Belum ada anggota yang mendaftar.</td></tr>';
            totalMembersEl.textContent = "0";
            return;
        }

        const dataRaw = snapshot.val();
        const dataArray = Object.values(dataRaw);
        
        tableBody.innerHTML = '';
        totalMembersEl.textContent = dataArray.length;

        // Tampilkan urutan terbaru di atas
        dataArray.reverse().forEach(member => {
            const tanggalRapi = member.tanggal ? new Date(member.tanggal).toLocaleDateString('id-ID') : '-';
            const row = `
                <tr>
                    <td>${tanggalRapi}</td>
                    <td><strong>${member.nama}</strong></td>
                    <td>${member.email}</td>
                    <td><span class="badge-minat">${member.minat}</span></td>
                    <td title="${member.pesan}">${member.pesan}</td>
                </tr>
            `;
            tableBody.innerHTML += row;
        });

    } catch (error) {
        console.error('Error memuat data:', error);
        tableBody.innerHTML = '<tr><td colspan="5" style="text-align: center; color: red;">Gagal memuat data. Periksa koneksi internet.</td></tr>';
    }
}