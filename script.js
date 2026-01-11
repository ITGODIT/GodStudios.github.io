// ============================================
// SCRIPT PRINCIPALE
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    initializeEffects();
    initializeSmoothScroll();
    initializeIntersectionObserver();
    initializeMobileMenu();
});

// ============================================
// EFFETTI VISUALI
// ============================================
function initializeEffects() {
    // Effetto parallax sulle cards
    document.querySelectorAll('.bot-card').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
        });
    });

    // Effetto sui tech card
    document.querySelectorAll('.tech-card').forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.background = `linear-gradient(135deg, rgba(88, 101, 242, 0.2) 0%, rgba(30, 144, 255, 0.2) 100%), var(--card-bg)`;
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.background = 'var(--card-bg)';
        });
    });
}

// ============================================
// SMOOTH SCROLL
// ============================================
function initializeSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// ============================================
// INTERSECTION OBSERVER - ANIMAZIONI ALL'ENTRATA
// ============================================
function initializeIntersectionObserver() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Osserva le sezioni
    document.querySelectorAll('.bot-card, .stat-card, .tech-card').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// ============================================
// MENU MOBILE
// ============================================
function initializeMobileMenu() {
    // Aggiungi listener per il resize
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            document.body.classList.remove('mobile-menu-open');
        }
    });

    // Chiudi menu mobile quando clicchi su un link
    document.querySelectorAll('.nav a').forEach(link => {
        link.addEventListener('click', function() {
            document.body.classList.remove('mobile-menu-open');
        });
    });
}

// ============================================
// ANIMAZIONE NUMERI STATISTICHE
// ============================================
function animateStats() {
    document.querySelectorAll('.stat-number').forEach(stat => {
        const finalNumber = parseInt(stat.textContent);
        const duration = 2000;
        const startTime = Date.now();

        function updateNumber() {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            if (typeof finalNumber === 'number' && !isNaN(finalNumber)) {
                const current = Math.floor(progress * finalNumber);
                stat.textContent = current;
            } else {
                stat.textContent = finalNumber;
            }
            
            if (progress < 1) {
                requestAnimationFrame(updateNumber);
            }
        }

        updateNumber();
    });
}

// Anima le statistiche quando entrano in vista
const statsObserver = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.dataset.animated) {
            entry.target.dataset.animated = 'true';
            animateStats();
            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

document.querySelector('.stats-section') && statsObserver.observe(document.querySelector('.stats-section'));

// ============================================
// EFFETTI AGGIUNTIVI
// ============================================

// Aggiungi una classe al header quando scrolli
window.addEventListener('scroll', function() {
    const header = document.querySelector('.header');
    if (window.scrollY > 50) {
        header.style.boxShadow = '0 4px 20px rgba(88, 101, 242, 0.5)';
    } else {
        header.style.boxShadow = '0 4px 20px rgba(88, 101, 242, 0.3)';
    }
});

// Effetto ripple sui bottoni
document.querySelectorAll('.btn').forEach(button => {
    button.addEventListener('click', function(e) {
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;

        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.classList.add('ripple');

        this.appendChild(ripple);
        setTimeout(() => ripple.remove(), 600);
    });
});

// CSS per l'effetto ripple (aggiunto dinamicamente)
const style = document.createElement('style');
style.textContent = `
    .btn {
        position: relative;
        overflow: hidden;
    }

    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.6);
        transform: scale(0);
        animation: ripple-animation 0.6s ease-out;
        pointer-events: none;
    }

    @keyframes ripple-animation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// ============================================
// FUNZIONI UTILITY
// ============================================

// Funzione per copiare il testo negli appunti
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        alert('Copiato negli appunti!');
    }).catch(err => {
        console.error('Errore nel copia: ', err);
    });
}

// Funzione per verificare se un elemento è visibile
function isElementVisible(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.bottom >= 0
    );
}

console.log('✅ Script caricato correttamente - My Discord Bots');
