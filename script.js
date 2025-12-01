// 프로젝트 데이터 로드 및 렌더링
async function loadProjects() {
    try {
        const response = await fetch('projects.json');
        const projects = await response.json();
        renderProjects(projects);
    } catch (error) {
        console.error('프로젝트를 불러오는 중 오류가 발생했습니다:', error);
    }
}

// 프로젝트 카드 렌더링
function renderProjects(projects) {
    const projectsGrid = document.getElementById('projectsGrid');
    
    if (!projectsGrid) return;

    projectsGrid.innerHTML = projects.map(project => `
        <div class="project-card">
            <h3>${project.title}</h3>
            <p>${project.description}</p>
            <div class="project-technologies">
                ${project.technologies.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
            </div>
            <a href="${project.link}" class="project-link" target="_blank" rel="noopener noreferrer">${project.link}</a>
        </div>
    `).join('');
}

// 모바일 메뉴 토글
function initMobileMenu() {
    const toggle = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.querySelector('.nav-menu');

    if (toggle && navMenu) {
        toggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
        });

        // 메뉴 링크 클릭 시 메뉴 닫기
        const navLinks = navMenu.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
            });
        });
    }
}

// Contact 폼 처리
function initContactForm() {
    const contactForm = document.getElementById('contactForm');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const message = document.getElementById('message').value;

            // mailto 링크 생성
            const subject = encodeURIComponent(`포트폴리오 문의: ${name}`);
            const body = encodeURIComponent(`이름: ${name}\n이메일: ${email}\n\n메시지:\n${message}`);
            const mailtoLink = `mailto:wkim@bible.ac.kr?subject=${subject}&body=${body}`;

            // 메일 클라이언트 열기
            window.location.href = mailtoLink;

            // 폼 초기화
            contactForm.reset();
        });
    }
}

// 부드러운 스크롤
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
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

// 초기화
document.addEventListener('DOMContentLoaded', () => {
    loadProjects();
    initMobileMenu();
    initContactForm();
    initSmoothScroll();
});

