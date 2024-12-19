// Initialize a WebSocket or Simulate Real-Time Data Updates
let threats = [];
let allThreats = [
    { time: '2024-12-18 10:00', type: 'Spoofing', risk: 35, description: 'Terjadi upaya login pengguna palsu.' },
    { time: '2024-12-18 10:15', type: 'Tampering', risk: 40, description: 'Modifikasi file tanpa izin terdeteksi.' },
    { time: '2024-12-18 10:30', type: 'Denial of Service', risk: 20, description: 'Lalu lintas tinggi dari IP mencurigakan terdeteksi.' },
    { time: '2024-12-18 10:45', type: 'Information Disclosure', risk: 25, description: 'Terjadi pengungkapan data sensitif.' },
    { time: '2024-12-18 11:00', type: 'Elevation of Privilege', risk: 30, description: 'Peningkatan hak akses tanpa izin terdeteksi.' },
    { time: '2024-12-18 11:15', type: 'Repudiation', risk: 18, description: 'Gagal melacak tindakan oleh pengguna terdeteksi.' }
];

// Simulated Real-Time Data Updates
function simulateRealTimeData() {
    const threatTypes = ["Spoofing", "Tampering", "Repudiation", "Information Disclosure", "Denial of Service", "Elevation of Privilege"];
    const randomDescriptions = {
        "Spoofing": [
            "Terjadi upaya login pengguna palsu.",
            "Pencurian identitas terdeteksi.",
            "Upaya penipuan pengguna teridentifikasi."
        ],
        "Tampering": [
            "Modifikasi file tanpa izin terdeteksi.",
            "Upaya manipulasi data teridentifikasi.",
            "Perubahan tidak sah dalam sistem ditemukan."
        ],
        "Repudiation": [
            "Gagal melacak tindakan oleh pengguna terdeteksi.",
            "Klaim tindakan pengguna tidak dapat diverifikasi.",
            "Pelanggaran rekaman aktivitas ditemukan."
        ],
        "Information Disclosure": [
            "Terjadi pengungkapan data sensitif.",
            "Akses tidak sah ke informasi rahasia ditemukan.",
            "Data pribadi berisiko bocor."
        ],
        "Denial of Service": [
            "Lalu lintas tinggi dari IP mencurigakan terdeteksi.",
            "Gangguan layanan oleh permintaan yang berlebihan ditemukan.",
            "Serangan DOS teridentifikasi dalam sistem."
        ],
        "Elevation of Privilege": [
            "Peningkatan hak akses tanpa izin terdeteksi.",
            "Upaya eskalasi hak pengguna ilegal ditemukan.",
            "Hak istimewa pengguna tidak sah diidentifikasi."
        ]
    };

    const newThreats = Array.from({ length: 3 }, () => {
        const randomType = threatTypes[Math.floor(Math.random() * threatTypes.length)];
        const randomDescription = randomDescriptions[randomType][Math.floor(Math.random() * randomDescriptions[randomType].length)];
        return {
            time: new Date().toLocaleTimeString(),
            type: randomType,
            risk: Math.floor(Math.random() * 50),
            description: randomDescription
        };
    });

    allThreats = allThreats.concat(newThreats);
    threats = allThreats; // Keep all threats for filtering
    applyFilters(); // Update filtered data

    if (allThreats.length > 50) { // Limit log size
        allThreats = allThreats.slice(-50);
    }

    console.log('Simulasi ancaman baru ditambahkan:', newThreats); // Debugging log
}

// Populate Threat Log
function populateThreatLog(data) {
    const tableBody = document.getElementById('threat-table-body');
    if (!tableBody) {
        console.error("Elemen 'threat-table-body' tidak ditemukan!");
        return;
    }
    console.log('Mengisi log ancaman dengan data:', data.slice(-5)); // Debugging log
    tableBody.innerHTML = '';
    data.slice(-5).forEach(threat => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${threat.time}</td>
            <td>${threat.type}</td>
            <td>${threat.risk}</td>
            <td>${threat.description}</td>
        `;
        tableBody.appendChild(row);
    });
}

// Apply Filters
function applyFilters() {
    const typeFilter = document.getElementById('threat-type').value;
    const riskFilter = parseInt(document.getElementById('risk-score').value, 10) || 0;

    console.log('Menerapkan filter:', { typeFilter, riskFilter }); // Debugging log

    const filteredThreats = allThreats.filter(threat => {
        const matchesType = typeFilter ? threat.type === typeFilter : true;
        const matchesRisk = threat.risk >= riskFilter;
        return matchesType && matchesRisk;
    });

    threats = filteredThreats; // Update the threats being displayed
    populateThreatLog(threats);
}

// Initialize Page
function initializePage() {
    console.log('Menginisialisasi halaman...'); // Debugging log

    // Populate with initial data
    applyFilters();

    document.getElementById('apply-filters').addEventListener('click', applyFilters);

    // Initialize Activity Chart
    const ctx = document.getElementById('activity-chart').getContext('2d');
    const activityChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [
                {
                    label: 'Total Aktivitas Ancaman',
                    data: [],
                    borderColor: '#0078d4',
                    fill: false,
                    tension: 0.1,
                    yAxisID: 'y'
                },
                {
                    label: 'Total Skor DREAD Ancaman',
                    data: [],
                    borderColor: '#d44f00',
                    fill: false,
                    tension: 0.1,
                    yAxisID: 'y1'
                }
            ]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: true,
                    position: 'top'
                }
            },
            scales: {
                y: {
                    type: 'linear',
                    display: true,
                    position: 'left',
                    title: {
                        display: true,
                        text: 'Jumlah Ancaman'
                    }
                },
                y1: {
                    type: 'linear',
                    display: true,
                    position: 'right',
                    title: {
                        display: true,
                        text: 'Total Skor DREAD'
                    },
                    grid: {
                        drawOnChartArea: false
                    }
                }
            }
        }
    });

    setInterval(() => {
        simulateRealTimeData();

        // Calculate Metrics
        const totalThreats = allThreats.length;
        const totalDreadScore = allThreats.reduce((sum, threat) => sum + threat.risk, 0);

        // Update Chart Data
        const now = new Date().toLocaleTimeString();
        activityChart.data.labels.push(now);
        activityChart.data.datasets[0].data.push(totalThreats); // Total threats
        activityChart.data.datasets[1].data.push(totalDreadScore); // Total DREAD score

        if (activityChart.data.labels.length > 20) { // Limit chart points
            activityChart.data.labels.shift();
            activityChart.data.datasets[0].data.shift();
            activityChart.data.datasets[1].data.shift();
        }

        console.log('Memperbarui grafik aktivitas dan DREAD...'); // Debugging log
        activityChart.update();
    }, 5000); // Update every 1 minute
}

// Run Initialization on Page Load
document.addEventListener('DOMContentLoaded', initializePage);
