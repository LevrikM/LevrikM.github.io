const SITE_CONFIG = {
    maintenanceMode: true, // dev mode 
    

    downloadLinks: {
        windows: "", // .exe
        portable: ""  // .zip
    }
};

document.addEventListener('DOMContentLoaded', () => {
    const body = document.body;
    const banner = document.getElementById('maintenance-banner');
    const badge = document.querySelector('.badge');
    
    const downloadBtns = [
        document.querySelector('.btn-nav'), 
        ...document.querySelectorAll('.big-download')
    ];

    if (SITE_CONFIG.maintenanceMode) {
        console.log('Maintenance Mode: ON');
        body.classList.add('is-maintenance');
        
        if(banner) banner.style.display = 'flex';
        
        if(badge) {
            badge.textContent = 'IN DEVELOPMENT';
            badge.style.borderColor = '#ef4444';
            badge.style.color = '#ef4444';
            badge.style.background = 'rgba(239, 68, 68, 0.15)';
        }

        downloadBtns.forEach(btn => {
            if(!btn) return;
            

            btn.classList.add('btn-disabled');
            btn.removeAttribute('href'); 
            
            if (btn.classList.contains('big-download')) {
                const iconClass = btn.querySelector('i').className;
                btn.innerHTML = `<i class="fas fa-tools"></i> В РАЗРАБОТКЕ <span class="sub-text">Загрузка недоступна</span>`;
            } else {
                btn.innerHTML = '<i class="fas fa-lock"></i> Закрыто';
            }
        });

    } else {
        console.log('Site is Live');
        
        const winBtn = document.querySelector('.big-download:first-child'); 
        const zipBtn = document.querySelector('.big-download:last-child'); 
        const navBtn = document.querySelector('.btn-nav');

        if(winBtn) winBtn.href = SITE_CONFIG.downloadLinks.windows;
        if(zipBtn) zipBtn.href = SITE_CONFIG.downloadLinks.portable;
        if(navBtn) navBtn.href = "#download";
    }
});


document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if(target) target.scrollIntoView({ behavior: 'smooth' });
    });
});

const observerOptions = { threshold: 0.1 };
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

document.querySelectorAll('.feature-card, .gallery-item, .timeline-item, .contact-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});


document.addEventListener('DOMContentLoaded', () => {
    const logoBtn = document.querySelector('.logo');
    
    if (logoBtn) {
        logoBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const closeBtn = document.querySelector('.lightbox-close');
    
    
    const galleryItems = document.querySelectorAll('.gallery-item');

    galleryItems.forEach(item => {
        item.addEventListener('click', () => {
            const img = item.querySelector('img');
            if (img) {
                lightboxImg.src = img.src; 
                lightbox.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        });
    });

    const closeLightbox = () => {
        lightbox.classList.remove('active');
        document.body.style.overflow = ''; 
        setTimeout(() => {
            lightboxImg.src = ''; 
        }, 300);
    };

 
    if (closeBtn) closeBtn.addEventListener('click', closeLightbox);

    if (lightbox) {
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                closeLightbox();
            }
        });
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightbox && lightbox.classList.contains('active')) {
            closeLightbox();
        }
    });
});


window.addEventListener('load', () => {
    setTimeout(() => {
        document.body.classList.add('loaded');
    }, 500);
});


document.addEventListener('DOMContentLoaded', () => {
    const cards = document.querySelectorAll('.feature-card, .contact-card');

    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            //  15 or 20, adjust for more/less tilt
            const rotateX = ((y - centerY) / 10) * -1; 
            const rotateY = (x - centerX) / 10;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
            
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
        });
    });
});