// Scroll lin
document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        const tinta = document.querySelector(this.getAttribute('href'));
        if (tinta) tinta.scrollIntoView({ behavior: 'smooth' });
    });
});

// Navigare shadow la scroll
window.addEventListener('scroll', () => {
    const nav = document.querySelector('nav');
    nav.style.boxShadow = window.scrollY > 50
        ? '0 4px 20px rgba(0,0,0,0.3)'
        : '0 2px 10px rgba(0,0,0,0.2)';
});

// ===== CITIRE vinuri.txt =====
fetch('vinuri.txt')
    .then(r => r.text())
    .then(text => {
        const linii = text.split('\n').map(l => l.trim());
        const vinuri = [];
        let vin = {};

        linii.forEach(linie => {
            if (linie.startsWith('NUME:')) {
                if (vin.nume) vinuri.push(vin);
                vin = { nume: linie.replace('NUME:', '').trim() };
            } else if (linie.startsWith('DESCRIERE:')) {
                vin.descriere = linie.replace('DESCRIERE:', '').trim();
            } else if (linie.startsWith('IMAGINE:')) {
                vin.imagine = linie.replace('IMAGINE:', '').trim();
            }
        });
        if (vin.nume) vinuri.push(vin);

        const container = document.getElementById('lista-vinuri');

        if (vinuri.length === 0) {
            container.innerHTML = '<p style="text-align:center;color:#888">Nu s-au găsit vinuri în fișier.</p>';
            return;
        }

        container.innerHTML = vinuri.map(vin => `
            <div class="card card-vin">
                <img src="${vin.imagine || ''}" alt="${vin.nume}"
                    class="vin-img"
                    onerror="this.src='https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?q=80&w=600&auto=format&fit=crop'"/>
                <div class="card-icon">🍷</div>
                <h4>${vin.nume}</h4>
                <p class="vin-descriere">${vin.descriere || ''}</p>
            </div>
        `).join('');

        // Animație la apariție
        document.querySelectorAll('.card').forEach(card => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px)';
            card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        });

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, { threshold: 0.1 });

        document.querySelectorAll('.card').forEach(card => observer.observe(card));
    })
    .catch(err => {
        console.error(err);
        document.getElementById('lista-vinuri').innerHTML =
            '<p style="text-align:center;color:#888">Eroare la încărcarea vinurilor.</p>';
    });
