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

// Incarca vinuri din vinuri.json
fetch('vinuri.json')
    .then(r => r.json())
    .then(vinuri => {
        const container = document.getElementById('lista-vinuri');
        container.innerHTML = vinuri.map(vin => `
            <div class="card card-vin">
                <img src="${vin.imagine}" alt="${vin.nume}" class="vin-img" />
                <div class="card-icon">🍷</div>
                <h4>${vin.nume}</h4>
                <p>${vin.descriere}</p>
            </div>
        `).join('');

        // Animatie
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
    .catch(() => {
        document.getElementById('lista-vinuri').innerHTML =
            '<p style="text-align:center;color:#888">Nu s-au putut încărca vinurile momentan.</p>';
    });
