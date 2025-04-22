// Variabel Global

let simulationRunning1 = false;
let simulationRunning2 = false;
let animationFrameId1 = null;
let animationFrameId2 = null;
let startTime1 = 0;
let startTime2 = 0;
let currentInclineLevel = 1;
let currentInclineLevel2 = 1;
let currentDistance = 20;
let currentDistance1 = 100; // Diubah dari 80 menjadi 100
let cartPosition1 = { x: 0, y: 0 };
let cartPosition2 = { x: 0, y: 0 };
let experimentData = {
    20: { time: 0, velocity: 0 },
    40: { time: 0, velocity: 0 },
    60: { time: 0, velocity: 0 },
    80: { time: 0, velocity: 0 }
};

// Fungsi untuk menangani tab

function openTab(evt, tabName) {
    // Sembunyikan semua konten tab
    const tabContents = document.getElementsByClassName("tab-content");
    for (let i = 0; i < tabContents.length; i++) {
        tabContents[i].classList.remove("active");
    }

    // Hapus kelas "active" dari semua tombol tab
    const tabButtons = document.getElementsByClassName("tab-button");
    for (let i = 0; i < tabButtons.length; i++) {
        tabButtons[i].classList.remove("active");
    }

    // Tampilkan konten tab yang dipilih dan tambahkan kelas "active" ke tombol yang dipilih
    document.getElementById(tabName).classList.add("active");
    evt.currentTarget.classList.add("active");
}

// Fungsi untuk menggambar kereta dinamika

function drawCart(ctx, x, y, width, height) {
    // Badan kereta
    ctx.fillStyle = "#e53935";
    ctx.fillRect(x, y, width, height);
    // Roda depan
    ctx.beginPath();
    ctx.arc(x + width*0.25, y + height, 5, 0, Math.PI * 2);
    ctx.fillStyle = "#333";
    ctx.fill();
    // Roda belakang
    ctx.beginPath();
    ctx.arc(x + width*0.75, y + height, 5, 0, Math.PI * 2);
    ctx.fillStyle = "#333";
    ctx.fill();
    // Detail kereta
    ctx.fillStyle = "#ffeb3b";
    ctx.fillRect(x + 5, y + 3, width - 10, 5);
    // Pegangan kereta
    ctx.beginPath();
    ctx.moveTo(x + width, y + height/2);
    ctx.lineTo(x + width + 10, y + height/2);
    ctx.lineWidth = 3;
    ctx.strokeStyle = "#333";
    ctx.stroke();
}

// Fungsi untuk menggambar balok bertingkat

function drawInclinedBlock(ctx, x, y, level) {
    const baseWidth = 100;
    const baseHeight = 20;
    const levelHeight = 15;
    
    // Gambar dasar balok
    ctx.fillStyle = "#8d6e63";
    ctx.fillRect(x, y - baseHeight, baseWidth, baseHeight);
    
    // Gambar tingkatan balok
    for (let i = 0; i < level; i++) {
        ctx.fillStyle = i % 2 === 0 ? "#a1887f" : "#8d6e63";
        ctx.fillRect(
            x,
            y - baseHeight - (i+1) * levelHeight,
            baseWidth - (i+1) * 10,
            levelHeight
        );
        
        // Tambahkan garis untuk tekstur kayu
        ctx.strokeStyle = "#5d4037";
        ctx.lineWidth = 1;
        for (let j = 0; j < 3; j++) {
            ctx.beginPath();
            ctx.moveTo(x + j * 30, y - baseHeight - i * levelHeight);
            ctx.lineTo(x + j * 30, y - baseHeight - (i+1) * levelHeight);
            ctx.stroke();
        }
    }
}

// Fungsi untuk menggambar tumpakan berpenjepit

function drawStopper(ctx, x, y) {
    // Dasar tumpakan
    ctx.fillStyle = "#3f51b5";
    ctx.fillRect(x - 15, y - 25, 30, 25);
    
    // Bagian penjepit
    ctx.fillStyle = "#1a237e";
    ctx.beginPath();
    ctx.moveTo(x - 15, y - 25);
    ctx.lineTo(x - 25, y - 40);
    ctx.lineTo(x + 25, y - 40);
    ctx.lineTo(x + 15, y - 25);
    ctx.closePath();
    ctx.fill();
    
    // Detail penjepit
    ctx.fillStyle = "#c5cae9";
    ctx.fillRect(x - 5, y - 35, 10, 5);
    
    // Tambahkan bayangan
    ctx.fillStyle = "rgba(0, 0, 0, 0.2)";
    ctx.fillRect(x - 15, y - 10, 30, 5);
}

// Fungsi untuk mengubah tingkat kemiringan pada simulasi 1

function changeInclineLevel() {
    currentInclineLevel = parseInt(document.getElementById("incline-level").value);
    resetSimulation1();
    drawSimulation1();
}

// Fungsi untuk memperbarui jarak pada simulasi 1

function updateDistance1() {
    currentDistance1 = parseInt(document.getElementById("distance-range1").value);
    document.getElementById("distance-value1").textContent = currentDistance1;
    resetSimulation1();
    drawSimulation1();
}

// Fungsi untuk mengubah jarak pada simulasi 2

function changeDistance() {
    currentDistance = parseInt(document.getElementById("distance-select").value);
    document.getElementById("distance2").textContent = currentDistance + " cm";
    resetSimulation2();
    drawSimulation2();
}

// Fungsi untuk memperbarui jarak pada simulasi 2

function updateDistance2() {
    currentDistance = parseInt(document.getElementById("distance-range2").value);
    document.getElementById("distance-value2").textContent = currentDistance;
    document.getElementById("distance2").textContent = currentDistance + " cm";
    resetSimulation2();
    drawSimulation2();
}

// Fungsi untuk mengubah tingkat kemiringan pada simulasi 2

function changeInclineLevel2() {
    currentInclineLevel2 = parseInt(document.getElementById("incline-level2").value);
    resetSimulation2();
    drawSimulation2();
}

// Fungsi untuk menghitung posisi Y berdasarkan tingkat kemiringan

function calculateYPosition(level) {
    const baseY = 300; // Posisi Y dasar
    const baseHeight = 20; // Tinggi dasar balok
    const levelHeight = 15; // Tinggi per tingkat balok
    const totalHeight = baseHeight + (level * levelHeight); // Total tinggi balok
    return baseY - totalHeight; // Posisi Y disesuaikan dengan tinggi balok
}

// Fungsi untuk memulai simulasi 1

function startSimulation1() {
    if (simulationRunning1) return;
    simulationRunning1 = true;
    startTime1 = performance.now();
    cartPosition1 = { x: 50, y: calculateYPosition(currentInclineLevel) };
    // Mulai animasi
    animateSimulation1();
}

// Fungsi untuk mereset simulasi 1

function resetSimulation1() {
    if (simulationRunning1) {
        cancelAnimationFrame(animationFrameId1);
        simulationRunning1 = false;
    }
    
    document.getElementById("time1").textContent = "0.00 s";
    document.getElementById("velocity1").textContent = "0.00 cm/s";
    cartPosition1 = { x: 50, y: calculateYPosition(currentInclineLevel) };
    drawSimulation1();
}

// Fungsi untuk memulai simulasi 2

function startSimulation2() {
    if (simulationRunning2) return;
    simulationRunning2 = true;
    startTime2 = performance.now();
    cartPosition2 = { x: 50, y: calculateYPosition(currentInclineLevel2) };
    // Mulai animasi
    animateSimulation2();
}

// Fungsi untuk mereset simulasi 2

function resetSimulation2() {
    if (simulationRunning2) {
        cancelAnimationFrame(animationFrameId2);
        simulationRunning2 = false;
    }
    
    document.getElementById("time2").textContent = "0.00 s";
    document.getElementById("velocity2").textContent = "0.00 cm/s";
    cartPosition2 = { x: 50, y: calculateYPosition(currentInclineLevel2) };
    drawSimulation2();
}

// Fungsi untuk menggambar simulasi 1

function drawSimulation1() {
    const canvas = document.getElementById("simulation-canvas1");
    const ctx = canvas.getContext("2d");
    
    // Bersihkan canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Gambar latar belakang
    ctx.fillStyle = "#f0f0f0";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Gambar balok bertingkat
    drawInclinedBlock(ctx, 10, 300, currentInclineLevel);
    
    // Gambar rel
    const startX = 50;
    const endX = startX + (currentDistance1 / 100) * 600; // Skala jarak disesuaikan untuk 100cm
    const startY = calculateYPosition(currentInclineLevel);
    const endY = 300;
    
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(endX, endY);
    ctx.lineWidth = 5;
    ctx.strokeStyle = "#555";
    ctx.stroke();
    
    // Gambar tumpakan berpenjepit
    drawStopper(ctx, endX, endY);
    
    // Gambar kereta
    const cartWidth = 40;
    const cartHeight = 20;
    
    // Hitung posisi kereta pada rel
    const progress = (cartPosition1.x - startX) / (endX - startX);
    const cartX = startX + progress * (endX - startX);
    const cartY = startY + progress * (endY - startY) - cartHeight;
    
    drawCart(ctx, cartX, cartY, cartWidth, cartHeight);
    
    // Gambar skala jarak
    ctx.fillStyle = "#333";
    ctx.font = "14px Arial";
    ctx.fillText("0 cm", startX, startY + 20);
    ctx.fillText(currentDistance1 + " cm", endX, endY + 20);
    
    // Gambar informasi tingkat kemiringan
    ctx.fillStyle = "#333";
    ctx.font = "16px Arial";
    ctx.fillText("Tingkat Kemiringan: " + currentInclineLevel, 50, 30);
}

// Fungsi untuk menggambar simulasi 2

function drawSimulation2() {
    const canvas = document.getElementById("simulation-canvas2");
    const ctx = canvas.getContext("2d");
    
    // Bersihkan canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Gambar latar belakang
    ctx.fillStyle = "#f0f0f0";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Gambar balok bertingkat
    drawInclinedBlock(ctx, 10, 300, currentInclineLevel2);
    
    // Gambar rel - disesuaikan dengan tinggi balok bertingkat
    const startX = 50;
    const endX = 650;
    const baseHeight = 20;
    const levelHeight = 15;
    const totalHeight = baseHeight + (currentInclineLevel2 * levelHeight);
    const startY = 300 - totalHeight; // Posisi Y disesuaikan dengan tinggi balok
    const endY = 300;
    
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(endX, endY);
    ctx.lineWidth = 5;
    ctx.strokeStyle = "#555";
    ctx.stroke();
    
    // Gambar tumpakan berpenjepit
    const distanceRatio = currentDistance / 100; // Diubah dari 80 menjadi 100
    const penjepit_x = startX + distanceRatio * (endX - startX);
    const penjepit_y = startY + distanceRatio * (endY - startY);
    drawStopper(ctx, penjepit_x, penjepit_y);
    
    // Gambar kereta
    const cartWidth = 40;
    const cartHeight = 20;
    
    // Hitung posisi kereta pada rel
    const progress = (cartPosition2.x - startX) / (penjepit_x - startX);
    const cartX = startX + progress * (penjepit_x - startX);
    const cartY = startY + progress * (penjepit_y - startY) - cartHeight;
    
    drawCart(ctx, cartX, cartY, cartWidth, cartHeight);
    
    // Gambar skala jarak
    ctx.fillStyle = "#333";
    ctx.font = "14px Arial";
    ctx.fillText("0 cm", startX, startY + 20);
    ctx.fillText(currentDistance + " cm", penjepit_x, penjepit_y + 20);
    
    // Gambar informasi jarak dan kemiringan
    ctx.fillStyle = "#333";
    ctx.font = "16px Arial";
    ctx.fillText("Jarak: " + currentDistance + " cm | Kemiringan: " + currentInclineLevel2, 50, 30);
}

// Fungsi untuk menganimasikan simulasi 1

function animateSimulation1() {
    const canvas = document.getElementById("simulation-canvas1");
    const ctx = canvas.getContext("2d");
    
    const currentTime = performance.now();
    const elapsedTime = (currentTime - startTime1) / 1000; // Konversi ke detik
    
    // Hitung posisi kereta berdasarkan waktu
    // Semakin tinggi kemiringan, semakin cepat kereta bergerak
    const acceleration = 50 * currentInclineLevel; // Percepatan dalam piksel/s²
    const distance = 0.5 * acceleration * Math.pow(elapsedTime, 2);
    
    // Konversi jarak ke posisi X pada canvas
    const startX = 50;
    const endX = startX + (currentDistance1 / 100) * 600; // Disesuaikan untuk 100cm
    const maxDistance = endX - startX; // Jarak maksimum dalam piksel
    
    cartPosition1.x = startX + (distance > maxDistance ? maxDistance : distance);
    
    // Gambar simulasi
    drawSimulation1();
    
    // Perbarui informasi waktu dan kecepatan
    document.getElementById("time1").textContent = elapsedTime.toFixed(2) + " s";
    
    // Hitung kecepatan rata-rata (jarak / waktu)
    const progress = (cartPosition1.x - startX) / (endX - startX);
    const distanceInCm = progress * currentDistance1; // Jarak dalam cm
    
    if (elapsedTime > 0) {
        const averageVelocity = distanceInCm / elapsedTime;
        document.getElementById("velocity1").textContent = averageVelocity.toFixed(2) + " cm/s";
    }
    
    // Jika kereta mencapai tumpakan berpenjepit
    if (cartPosition1.x >= endX - 40) { // 40 adalah lebar kereta
        simulationRunning1 = false;
        return;
    }
    
    // Lanjutkan animasi
    if (simulationRunning1) {
        animationFrameId1 = requestAnimationFrame(animateSimulation1);
    }
}

// Fungsi untuk menganimasikan simulasi 2

function animateSimulation2() {
    const canvas = document.getElementById("simulation-canvas2");
    const ctx = canvas.getContext("2d");
    
    const currentTime = performance.now();
    const elapsedTime = (currentTime - startTime2) / 1000; // Konversi ke detik
    
    // Hitung posisi kereta berdasarkan waktu
    const acceleration = 50 * currentInclineLevel2; // Percepatan dalam piksel/s²
    const distance = 0.5 * acceleration * Math.pow(elapsedTime, 2);
    
    // Konversi jarak ke posisi X pada canvas
    const startX = 50;
    const endX = 650;
    
    // Hitung posisi tumpakan berpenjepit
    const distanceRatio = currentDistance / 100; // Diubah dari 80 menjadi 100
    const penjepit_x = startX + distanceRatio * (endX - startX);
    
    // Hitung jarak maksimum untuk simulasi ini
    const maxSimDistance = penjepit_x - startX;
    
    cartPosition2.x = startX + (distance > maxSimDistance ? maxSimDistance : distance);
    
    // Gambar simulasi
    drawSimulation2();
    
    // Perbarui informasi waktu dan kecepatan
    document.getElementById("time2").textContent = elapsedTime.toFixed(2) + " s";
    
    // Hitung kecepatan rata-rata (jarak / waktu)
    const progress = (cartPosition2.x - startX) / (penjepit_x - startX);
    const distanceInCm = progress * currentDistance;
    
    if (elapsedTime > 0) {
        const averageVelocity = distanceInCm / elapsedTime;
        document.getElementById("velocity2").textContent = averageVelocity.toFixed(2) + " cm/s";
    }
    
    // Jika kereta mencapai tumpakan berpenjepit
    if (cartPosition2.x >= penjepit_x - 40) { // 40 adalah lebar kereta
        simulationRunning2 = false;
        
        // Simpan data percobaan
        experimentData[currentDistance] = {
            time: elapsedTime,
            velocity: parseFloat(document.getElementById("velocity2").textContent)
        };
        
        // Perbarui tabel data
        updateDataTable();
        return;
    }
    
    // Lanjutkan animasi
    if (simulationRunning2) {
        animationFrameId2 = requestAnimationFrame(animateSimulation2);
    }
}

// Fungsi untuk memperbarui tabel data

function updateDataTable() {
    // Perbarui waktu dan kecepatan
    for (let distance of [20, 40, 60, 80]) {
        if (experimentData[distance].time > 0) {
            document.getElementById(`time-${distance}`).textContent = experimentData[distance].time.toFixed(2) + " s";
            document.getElementById(`velocity-${distance}`).textContent = experimentData[distance].velocity.toFixed(2) + " cm/s";
        }
    }
    
    // Hitung dan perbarui percepatan
    if (experimentData[20].time > 0) {
        const a20 = experimentData[20].velocity / experimentData[20].time;
        document.getElementById("acceleration-20").textContent = a20.toFixed(2) + " cm/s²";
    }
    
    if (experimentData[20].time > 0 && experimentData[40].time > 0) {
        const v1 = experimentData[20].velocity;
        const v2 = experimentData[40].velocity;
        const t1 = experimentData[20].time;
        const t2 = experimentData[40].time;
        const a40 = (v2 - v1) / (t2 - t1);
        document.getElementById("acceleration-40").textContent = a40.toFixed(2) + " cm/s²";
    }
    
    if (experimentData[40].time > 0 && experimentData[60].time > 0) {
        const v1 = experimentData[40].velocity;
        const v2 = experimentData[60].velocity;
        const t1 = experimentData[40].time;
        const t2 = experimentData[60].time;
        const a60 = (v2 - v1) / (t2 - t1);
        document.getElementById("acceleration-60").textContent = a60.toFixed(2) + " cm/s²";
    }
    
    if (experimentData[60].time > 0 && experimentData[80].time > 0) {
        const v1 = experimentData[60].velocity;
        const v2 = experimentData[80].velocity;
        const t1 = experimentData[60].time;
        const t2 = experimentData[80].time;
        const a80 = (v2 - v1) / (t2 - t1);
        document.getElementById("acceleration-80").textContent = a80.toFixed(2) + " cm/s²";
    }
}

// Fungsi untuk memeriksa jawaban kuis

function checkAnswers() {
    // Jawaban yang benar
    const correctAnswers = {
        q1: "b", // 5 m/s
        q2: "b", // 2 m/s²
        q3: "b" // Komponen gaya berat yang sejajar dengan bidang miring lebih besar
    };
    
    // Periksa jawaban untuk setiap soal
    for (let i = 1; i <= 3; i++) {
        const selectedAnswer = document.querySelector(`input[name="q${i}"]:checked`);
        const feedbackElement = document.getElementById(`feedback${i}`);
        
        if (!selectedAnswer) {
            feedbackElement.textContent = "Silakan pilih jawaban terlebih dahulu.";
            feedbackElement.className = "quiz-feedback incorrect";
            continue;
        }
        
        if (selectedAnswer.value === correctAnswers[`q${i}`]) {
            feedbackElement.textContent = "Jawaban benar!";
            feedbackElement.className = "quiz-feedback correct";
        } else {
            feedbackElement.textContent = "Jawaban salah. Silakan coba lagi.";
            feedbackElement.className = "quiz-feedback incorrect";
        }
    }
}

// Inisialisasi saat halaman dimuat

window.onload = function() {
    // Gambar simulasi awal
    drawSimulation1();
    drawSimulation2();
    
    // Tambahkan event listener untuk navigasi smooth scroll
    document.querySelectorAll('nav a').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
        });
    });
};
