// 전역 변수
let isLoggedIn = false;
let currentPage = 'home';
let allProjects = [];
let allGalleryItems = [];

// 페이지 초기화
document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initLogin();
    initSearch();
    loadProjects();
    loadGallery();
    initContactForm();
    showPage('home');
});

// 네비게이션 초기화
function initNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const mobileToggle = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.querySelector('.nav-menu');

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const page = link.getAttribute('data-page');
            showPage(page);
            navMenu.classList.remove('active');
        });
    });

    if (mobileToggle && navMenu) {
        mobileToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
        });
    }
}

// 페이지 전환
function showPage(page) {
    const pages = document.querySelectorAll('.page');
    const navLinks = document.querySelectorAll('.nav-link');

    pages.forEach(p => p.classList.remove('active'));
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('data-page') === page) {
            link.classList.add('active');
        }
    });

    const targetPage = document.getElementById(page);
    if (targetPage) {
        targetPage.classList.add('active');
        currentPage = page;
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

// 로그인 기능
function initLogin() {
    const loginBtn = document.getElementById('loginBtn');
    const logoutBtn = document.getElementById('logoutBtn');
    const loginModal = document.getElementById('loginModal');
    const closeModal = document.querySelector('.close-modal');
    const loginForm = document.getElementById('loginForm');

    if (loginBtn) {
        loginBtn.addEventListener('click', () => {
            loginModal.style.display = 'block';
        });
    }

    if (closeModal) {
        closeModal.addEventListener('click', () => {
            loginModal.style.display = 'none';
        });
    }

    window.addEventListener('click', (e) => {
        if (e.target === loginModal) {
            loginModal.style.display = 'none';
        }
    });

    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const username = document.getElementById('loginUsername').value;
            const password = document.getElementById('loginPassword').value;

            // 간단한 로그인 검증 (실제로는 서버와 통신해야 함)
            if (username && password) {
                isLoggedIn = true;
                loginBtn.style.display = 'none';
                if (logoutBtn) logoutBtn.style.display = 'block';
                loginModal.style.display = 'none';
                loginForm.reset();
                alert('로그인 성공! 🎉');
            } else {
                alert('아이디와 비밀번호를 입력해주세요.');
            }
        });
    }

    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            isLoggedIn = false;
            loginBtn.style.display = 'block';
            logoutBtn.style.display = 'none';
            alert('로그아웃 되었습니다.');
        });
    }
}

// 검색 기능
function initSearch() {
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.querySelector('.search-btn');
    const searchContainer = document.querySelector('.search-container');

    // 검색 결과 컨테이너 생성
    const searchResults = document.createElement('div');
    searchResults.className = 'search-results';
    searchResults.id = 'searchResults';
    searchContainer.appendChild(searchResults);

    function performSearch() {
        const query = searchInput.value.toLowerCase().trim();
        const results = [];

        if (query === '') {
            searchResults.classList.remove('active');
            return;
        }

        // 프로젝트 검색
        allProjects.forEach(project => {
            if (project.title.toLowerCase().includes(query) ||
                project.description.toLowerCase().includes(query) ||
                project.technologies.some(tech => tech.toLowerCase().includes(query))) {
                results.push({
                    type: 'project',
                    title: project.title,
                    description: project.description,
                    data: project
                });
            }
        });

        // 갤러리 검색
        allGalleryItems.forEach(item => {
            if (item.title.toLowerCase().includes(query) ||
                item.description.toLowerCase().includes(query)) {
                results.push({
                    type: 'gallery',
                    title: item.title,
                    description: item.description,
                    data: item
                });
            }
        });

        displaySearchResults(results);
    }

    function displaySearchResults(results) {
        if (results.length === 0) {
            searchResults.innerHTML = '<div class="search-result-item">검색 결과가 없습니다.</div>';
        } else {
            searchResults.innerHTML = results.map(result => `
                <div class="search-result-item" data-type="${result.type}">
                    <strong>${result.title}</strong>
                    <p style="font-size: 0.875rem; color: var(--text-secondary); margin-top: 0.25rem;">${result.description}</p>
                </div>
            `).join('');

            // 검색 결과 클릭 이벤트
            searchResults.querySelectorAll('.search-result-item').forEach(item => {
                item.addEventListener('click', () => {
                    const type = item.getAttribute('data-type');
                    if (type === 'project') {
                        showPage('home');
                        setTimeout(() => {
                            document.getElementById('projectsGrid').scrollIntoView({ behavior: 'smooth' });
                        }, 100);
                    } else if (type === 'gallery') {
                        showPage('home');
                        setTimeout(() => {
                            document.getElementById('galleryGrid').scrollIntoView({ behavior: 'smooth' });
                        }, 100);
                    }
                    searchResults.classList.remove('active');
                    searchInput.value = '';
                });
            });
        }

        searchResults.classList.add('active');
    }

    if (searchInput) {
        searchInput.addEventListener('input', performSearch);
        searchInput.addEventListener('focus', () => {
            if (searchInput.value.trim() !== '') {
                performSearch();
            }
        });
    }

    if (searchBtn) {
        searchBtn.addEventListener('click', performSearch);
    }

    // 검색창 외부 클릭 시 결과 숨기기
    document.addEventListener('click', (e) => {
        if (!searchContainer.contains(e.target)) {
            searchResults.classList.remove('active');
        }
    });
}

// 프로젝트 데이터 로드
async function loadProjects() {
    try {
        const response = await fetch('projects.json');
        const projects = await response.json();
        allProjects = projects;
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

// 갤러리 데이터 로드
async function loadGallery() {
    try {
        const response = await fetch('gallery.json');
        const galleryItems = await response.json();
        allGalleryItems = galleryItems;
        renderGallery(galleryItems);
    } catch (error) {
        console.error('갤러리를 불러오는 중 오류가 발생했습니다:', error);
    }
}

// 갤러리 렌더링
function renderGallery(galleryItems) {
    const galleryGrid = document.getElementById('galleryGrid');
    
    if (!galleryGrid) return;

    galleryGrid.innerHTML = galleryItems.map(item => `
        <div class="gallery-item">
            <img src="${item.image}" alt="${item.title}" loading="lazy">
            <div class="gallery-item-overlay">
                <div class="gallery-item-title">${item.title}</div>
                <div class="gallery-item-description">${item.description}</div>
            </div>
        </div>
    `).join('');

    // 갤러리 아이템 클릭 이벤트 (이미지 확대 등 추가 기능 가능)
    galleryGrid.querySelectorAll('.gallery-item').forEach(item => {
        item.addEventListener('click', () => {
            // 여기에 이미지 확대 모달 등을 추가할 수 있습니다
            console.log('갤러리 아이템 클릭:', item);
        });
    });
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
            const mailtoLink = `mailto:roskl0838@naver.com?subject=${subject}&body=${body}`;

            // 메일 클라이언트 열기
            window.location.href = mailtoLink;

            // 폼 초기화
            contactForm.reset();
            alert('메일 앱이 열립니다! 📧');
        });
    }
}
