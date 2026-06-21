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

// ===== GALERIE =====
fetch('galerie.txt')
    .then(r => r.text())
    .then(text => {
        const linii = text.split('\n').map(l => l.trim());
        const imagini = [];
        let img = {};

        linii.forEach(linie => {
            if (linie.startsWith('TITLU:')) {
                if (img.imagine) imagini.push(img);
                img = { titlu: linie.replace('TITLU:', '').trim() };
            } else if (linie.startsWith('IMAGINE:')) {
                img.imagine = linie.replace('IMAGINE:', '').trim();
            }
        });
        if (img.imagine) imagini.push(img);

        const grid = document.getElementById('galerie-grid');

        if (imagini.length === 0) {
            grid.innerHTML = '<p class="galerie-gol">Nu există imagini în galerie momentan.</p>';
            return;
        }

        grid.innerHTML = imagini.map((item, index) => `
            <div class="galerie-item" data-index="${index}" data-titlu="${item.titlu || ''}" data-src="${item.imagine}">
                <img src="${item.imagine}"
                     alt="${item.titlu || 'Imagine galerie'}"
                     onerror="this.src='https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?q=80&w=600&auto=format&fit=crop'"/>
                <div class="galerie-overlay">${item.titlu || ''}</div>
            </div>
        `).join('');

        // Animatie la aparitie
        document.querySelectorAll('.galerie-item').forEach(item => {
            item.style.opacity = '0';
            item.style.transform = 'scale(0.95)';
            item.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        });

        const observerGalerie = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'scale(1)';
                }
            });
        }, { threshold: 0.1 });

        document.querySelectorAll('.galerie-item').forEach(item => observerGalerie.observe(item));

        // Lightbox - deschide la click
        document.querySelectorAll('.galerie-item').forEach(item => {
            item.addEventListener('click', () => {
                const lb = document.getElementById('lightbox');
                document.getElementById('lightbox-img').src = item.dataset.src;
                document.getElementById('lightbox-titlu').textContent = item.dataset.titlu;
                lb.classList.add('activ');
            });
        });
    })
    .catch(() => {
        const grid = document.getElementById('galerie-grid');
        if (grid) grid.innerHTML = '<p class="galerie-gol">Fisierul galerie.txt nu a fost gasit.</p>';
    });

// Lightbox - inchide
document.getElementById('lightbox-close').addEventListener('click', () => {
    document.getElementById('lightbox').classList.remove('activ');
});
document.getElementById('lightbox').addEventListener('click', function(e) {
    if (e.target === this) this.classList.remove('activ');
});
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') document.getElementById('lightbox').classList.remove('activ');
});
