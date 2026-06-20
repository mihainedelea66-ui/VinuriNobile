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

// Citire și procesare automată din vinuri.txt
fetch('vinuri.txt')
    .then(r => r.text())
    .then(text => {
        // Curățăm eventualele taguri generate automat la copy-paste
        const textCurat = text.replace(/\/g, '');
        
        // Împărțim fișierul după cuvântul cheie TITLU:
        const bucati = textCurat.split(/TITLU:/i);
        const vinuri = [];

        bucati.forEach(bucata => {
            if (!bucata.trim()) return;

            // Identificăm unde începe descrierea și imaginea în fiecare bloc
            const descriereIndex = bucata.search(/DESCRIERE:/i);
            const imagineIndex = bucata.search(/IMAGINE:/i);

            if (descriereIndex !== -1 && imagineIndex !== -1) {
                const nume = bucata.substring(0, descriereIndex).trim();
                
                // Extragem descrierea dintre cuvântul DESCRIERE: și IMAGINE:
                let descriere = bucata.substring(descriereIndex + 10, imagineIndex).trim();
                // Înlocuim trecerile la linie nouă cu <br> pentru a păstra așezarea în pagină
                descriere = descriere.replace(/\n/g, '<br>');

                // Extragem link-ul sau calea imaginii de după IMAGINE:
                const imagine = bucata.substring(imagineIndex + 8).trim().split('\n')[0].trim();

                vinuri.push({ nume, descriere, imagine });
            }
        });

        const container = document.getElementById('lista-vinuri');
        
        if (vinuri.length === 0) {
            container.innerHTML = '<p style="text-align:center;color:#888">Nu s-au găsit vinuri în fișier.</p>';
            return;
        }

        // Generăm HTML-ul pentru fiecare card
        container.innerHTML = vinuri.map(vin => `
            <div class="card card-vin">
                <img src="${vin.imagine}" alt="${vin.nume}" class="vin-img" onerror="this.src='https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?q=80&w=600&auto=format&fit=crop'"/>
                <div class="card-icon">🍷</div>
                <h4>${vin.nume}</h4>
                <p style="text-align: left; padding: 0 10px;">${vin.descriere}</p>
            </div>
        `).join('');

        // Animație la apariție (Intersection Observer)
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
            '<p style="text-align:center;color:#888">Nu s-a putut încărca fișierul vinuri.txt. Asigură-te că rulezi proiectul printr-un server local (ex: Live Server din VS Code).</p>';
    });
