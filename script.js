// Scroll lin la sectiuni
document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        const tinta = document.querySelector(this.getAttribute('href'));
        if (tinta) {
            tinta.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// Navigare schimba culoarea la scroll
window.addEventListener('scroll', () => {
    const nav = document.querySelector('nav');
    if (window.scrollY > 50) {
        nav.style.boxShadow = '0 4px 20px rgba(0,0,0,0.3)';
    } else {
        nav.style.boxShadow = '0 2px 10px rgba(0,0,0,0.2)';
    }
});

// Animatie carduri la scroll
const carduri = document.querySelectorAll('.card');
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, { threshold: 0.1 });

carduri.forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(card);
});