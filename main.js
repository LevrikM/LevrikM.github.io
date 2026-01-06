const config = {
    rowCount: 12,
    itemsPerRow: 7,
    spacingX: 60,
    spacingY: 10,
    baseSpeed: 0.02,
    warpSpeed: 4.0,
    techList: [
        { text: 'HTML5', color: '#e34c26' },
        { text: 'CSS3', color: '#264de4' },
        { text: 'JAVASCRIPT', color: '#f7df1e' },
        { text: 'REACT', color: '#61dafb' },
        { text: 'VUE', color: '#42b883' },
        { text: 'NODE.JS', color: '#339933' },
        { text: 'PYTHON', color: '#3776ab' },
        { text: 'SWIFT', color: '#264de4' },
        { text: 'C++', color: '#9d00ff' },
        { text: 'TYPESCRIPT', color: '#3178c6' },
        { text: 'GIT', color: '#f05032' },
        { text: 'DOCKER', color: '#2496ed' },
        { text: 'JAVA', color: '#ffffff' },
        { text: 'NEXT.JS', color: '#ffffff' },
        { text: 'Kotlin', color: '#f05032' },
        { text: 'C#', color: '#9d00ff' },
        { text: 'ASSEMBLER', color: '#dea584' },
        { text: 'SQL', color: '#00ccff' },
        { text: 'PHP', color: '#4c1fc7ff' },
    ]
};

function getInitialLang() {
    const saved = localStorage.getItem('site_lang');
    if (saved) return saved;
    const nav = (navigator.language || navigator.userLanguage).toLowerCase();
    if (nav.includes('uk') || nav.includes('ua')) return 'ua';
    if (nav.includes('ru')) return 'ru';
    return 'en';
}

let state = {
    isAnimating: true,
    isWarping: false,
    warpProgress: 0, 
    lang: getInitialLang()
};

const translations = {
    ua: {
        header_title: "LEVRIKM",
        header_subtitle: "ЦИФРОВИЙ ШЛЮЗ",
        port_tag: "ОСНОВНИЙ ПРОФІЛЬ",
        port_title: "Портфоліо",
        port_desc: "Переглянути повний стек технологій, комерційний досвід та інформацію про мене.",
        projects_title: "МОЇ ПРОЄКТИ",
        p1_type: "Десктоп Додаток",
        p2_type: "Веб Аналітика",
        p3_type: "Веб Додаток"
    },
    en: {
        header_title: "LEVRIKM",
        header_subtitle: "DIGITAL GATEWAY",
        port_tag: "MAIN PROFILE",
        port_title: "Portfolio",
        port_desc: "View full tech stack, commercial experience, and information about me.",
        projects_title: "MY PROJECTS",
        p1_type: "Desktop App",
        p2_type: "Web Analytics",
        p3_type: "Web App"
    },
    ru: {
        header_title: "LEVRIKM",
        header_subtitle: "ЦИФРОВОЙ ШЛЮЗ",
        port_tag: "ОСНОВНОЙ ПРОФИЛЬ",
        port_title: "Портфолио",
        port_desc: "Просмотр полного стека технологий, коммерческого опыта и информации обо мне.",
        projects_title: "МОИ ПРОЕКТЫ",
        p1_type: "Десктоп Приложение",
        p2_type: "Веб Аналитика",
        p3_type: "Веб Приложение"
    }
};

const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x020203, 0.012);

const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
document.getElementById('canvas-container').appendChild(renderer.domElement);

function createTextTexture(text, color) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const fontSize = 80;
    
    ctx.font = `900 ${fontSize}px "Space Grotesk", sans-serif`;
    const textWidth = ctx.measureText(text).width;
    
    canvas.width = textWidth + 20;
    canvas.height = fontSize + 20;

    ctx.font = `900 ${fontSize}px "Space Grotesk", sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    ctx.fillStyle = color;
    ctx.fillText(text, canvas.width / 2, canvas.height / 2);

    const texture = new THREE.CanvasTexture(canvas);
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.needsUpdate = true;
    return { texture, ratio: canvas.width / canvas.height };
}

const textures = config.techList.map(t => createTextTexture(t.text, t.color));
const stripGroup = new THREE.Group();
scene.add(stripGroup);

const rows = [];
const totalWidth = config.itemsPerRow * config.spacingX;
const startY = ((config.rowCount - 1) * config.spacingY) / 2;

for (let row = 0; row < config.rowCount; row++) {
    const y = startY - (row * config.spacingY);
    const direction = row % 2 === 0 ? 1 : -1;
    
    const rowObj = {
        sprites: [],
        background: null,
        y: y,
        direction: direction
    };

    const bgGeo = new THREE.PlaneGeometry(2000, config.spacingY - 2);
    const bgMat = new THREE.MeshBasicMaterial({ 
        color: 0xffffff, 
        transparent: true, 
        opacity: 0.02, 
        side: THREE.DoubleSide 
    });
    const bgMesh = new THREE.Mesh(bgGeo, bgMat);
    bgMesh.position.set(0, y, -40);
    stripGroup.add(bgMesh);
    rowObj.background = bgMesh;

    for (let i = 0; i < config.itemsPerRow; i++) {
        const tech = textures[(row * config.itemsPerRow + i) % textures.length];
        const material = new THREE.SpriteMaterial({ 
            map: tech.texture, 
            transparent: true, 
            opacity: 0.8,
            depthWrite: false
        });
        
        const sprite = new THREE.Sprite(material);
        sprite.scale.set(6 * tech.ratio, 6, 1);
        
        const x = (i * config.spacingX) - (totalWidth / 2);
        sprite.position.set(x, y, -39); 

        sprite.userData = {
            initialRelX: x, 
            relX: x 
        };

        stripGroup.add(sprite);
        rowObj.sprites.push(sprite);
    }
    rows.push(rowObj);
}

camera.position.z = 40;

let mouseX = 0, mouseY = 0;

function animate() {
    if (!state.isAnimating && !state.isWarping && state.warpProgress === 0) return;
    requestAnimationFrame(animate);

    if (state.isWarping) {
        state.warpProgress = Math.min(state.warpProgress + 0.02, 1);
    }

    const t = state.warpProgress;
    const smoothT = t * t * (3 - 2 * t);

    rows.forEach(row => {
        if (state.warpProgress < 1) {
            const speed = config.baseSpeed * row.direction * (1 + smoothT * 10);
            
            row.sprites.forEach(sprite => {
                sprite.userData.relX += speed * 4;
                if (sprite.userData.relX > totalWidth / 2) sprite.userData.relX -= totalWidth;
                if (sprite.userData.relX < -totalWidth / 2) sprite.userData.relX += totalWidth;
            });
        }

        const flatY = row.y;
        const flatZ = -40;
        
        const radius = 30;
        const angleRow = (row.y / (startY * 2)) * Math.PI * 2; 

        row.background.material.opacity = 0.02 * (1 - smoothT); 

        row.sprites.forEach(sprite => {
            const flatX = sprite.userData.relX;
            
            const cylX = Math.cos(angleRow) * radius;
            const cylY = Math.sin(angleRow) * radius;
            const cylZ = flatZ - (flatX * 2); 

            sprite.position.x = flatX * (1 - smoothT) + cylX * smoothT;
            sprite.position.y = flatY * (1 - smoothT) + cylY * smoothT;
            
            if (state.isWarping) {
                const flySpeed = (Date.now() % 1000) * 0.2 * smoothT; 
                sprite.position.z = (flatZ * (1 - smoothT) + cylZ * smoothT) + flySpeed * config.warpSpeed;
                
                if (sprite.position.z > 20) sprite.position.z -= 400;
                
                sprite.material.opacity = 0.8;
            } else {
                sprite.position.z = flatZ;
                sprite.material.opacity = 0.2 + (0.6 * (1 - Math.abs(sprite.position.x) / (totalWidth/1.5)));
            }
        });
    });

    if (!state.isWarping) {
        camera.position.x += (mouseX * 5 - camera.position.x) * 0.05;
        camera.position.y += (mouseY * 5 - camera.position.y) * 0.05;
        camera.position.z = 40;
        camera.rotation.z = 0;
    } else {
        camera.position.x *= 0.95;
        camera.position.y *= 0.95;
        camera.position.z = 40 - (smoothT * 20); 
        camera.rotation.z += 0.02;
        
        if (camera.fov < 110) {
            camera.fov += 0.5;
            camera.updateProjectionMatrix();
        }
    }

    renderer.render(scene, camera);
}

animate();

document.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth) - 0.5;
    mouseY = (e.clientY / window.innerHeight) - 0.5;

    document.querySelectorAll('.card').forEach(card => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);
    });
    
    if (!state.isWarping) {
        document.querySelectorAll('.card').forEach(card => {
            const rect = card.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            if(Math.abs(e.clientX - centerX) < 500) {
                 const rotateY = ((e.clientX - centerX) / 40);
                 const rotateX = -((e.clientY - centerY) / 40);
                 card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
            } else {
                 card.style.transform = `perspective(1000px) rotateX(0) rotateY(0)`;
            }
        });
    }
});

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

const toggleBtn = document.getElementById('anim-toggle');
toggleBtn.addEventListener('click', () => {
    state.isAnimating = !state.isAnimating;
    toggleBtn.innerHTML = state.isAnimating ? '<span class="icon-play">❚❚</span>' : '<span>▶</span>';
    if(state.isAnimating) animate();
});

function setLang(langKey, initial = false) {
    state.lang = langKey;
    localStorage.setItem('site_lang', langKey);

    const elements = document.querySelectorAll('[data-key]');
    const buttons = document.querySelectorAll('.lang-btn');

    buttons.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.lang === langKey);
    });

    if (initial) {
        elements.forEach(el => {
            const key = el.getAttribute('data-key');
            if (translations[langKey][key]) {
                el.innerText = translations[langKey][key];
            }
        });
        return;
    }
    
    elements.forEach(el => el.classList.add('text-blur-out'));

    setTimeout(() => {
        elements.forEach(el => {
            const key = el.getAttribute('data-key');
            if (translations[langKey][key]) {
                el.innerText = translations[langKey][key];
            }
        });
        setTimeout(() => { elements.forEach(el => el.classList.remove('text-blur-out')); }, 50);
    }, 300);
}

document.querySelectorAll('.lang-btn').forEach(btn => btn.addEventListener('click', () => setLang(btn.dataset.lang)));
setLang(state.lang, true);

document.getElementById('year').textContent = new Date().getFullYear();

document.querySelectorAll('.warp-link').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        const targetUrl = this.href;

        state.isWarping = true;
        state.isAnimating = true; 
        
        const uiElements = [
            document.querySelector('.container'),
            document.querySelector('.top-nav'),
            document.querySelector('.simple-footer')
        ];
        
        uiElements.forEach(el => {
            if(el) {
                el.style.transition = 'opacity 0.8s ease-in';
                el.style.opacity = '0';
                el.style.transform = 'scale(1.1)'; 
            }
        });

        setTimeout(() => {
            const overlay = document.querySelector('.transition-overlay');
            overlay.classList.add('active');
        }, 1800); 

        setTimeout(() => {
            window.location.href = targetUrl;
        }, 2200);
    });
});