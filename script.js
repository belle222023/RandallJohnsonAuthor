// ===== CURSOR =====
const cur = document.getElementById('cursor');
const ring = document.getElementById('cursor-ring');
if (cur && ring) {
    document.addEventListener('mousemove', e => {
        cur.style.left = e.clientX + 'px';
        cur.style.top = e.clientY + 'px';
        setTimeout(() => {
            ring.style.left = e.clientX + 'px';
            ring.style.top = e.clientY + 'px';
        }, 60);
    });
}

// ===== PROGRESS BAR =====
const bar = document.getElementById('progress-bar');
window.addEventListener('scroll', () => {
    if (bar) {
        const pct = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
        bar.style.width = pct + '%';
    }
    const header = document.getElementById('header') || document.querySelector('header');
    if (header) header.classList.toggle('scrolled', window.scrollY > 50);
    checkReveals();
}, { passive: true });

// ===== NAVIGATION & PAGE SWITCHING =====
const navItems = document.querySelectorAll('.nav-item');
const pages    = document.querySelectorAll('.page');

// Works whether you use id="hamburger" or class="hamburger" in your HTML
// Same for id="navLinks" or class="nav-links"
const hamburger = document.getElementById('hamburger')  || document.querySelector('.hamburger');
const navLinks  = document.getElementById('navLinks')   || document.querySelector('.nav-links');

// ===== HAMBURGER MENU TOGGLE =====
function openMobileMenu() {
    if (hamburger) hamburger.classList.add('active');
    if (navLinks)  navLinks.classList.add('active');
}

function closeMobileMenu() {
    if (hamburger) hamburger.classList.remove('active');
    if (navLinks)  navLinks.classList.remove('active');
}

function toggleMenu() {
    if (!hamburger || !navLinks) return;
    hamburger.classList.contains('active') ? closeMobileMenu() : openMobileMenu();
}

// Hamburger button click
if (hamburger) {
    hamburger.addEventListener('click', function (e) {
        e.stopPropagation(); // stop document click from firing immediately
        toggleMenu();
    });
}

// Close when tapping/clicking outside the nav
document.addEventListener('click', function (e) {
    if (
        navLinks  && navLinks.classList.contains('active') &&
        hamburger && !hamburger.contains(e.target) &&
                     !navLinks.contains(e.target)
    ) {
        closeMobileMenu();
    }
});

// Close on Escape key
document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeMobileMenu();
});

// ===== PAGE NAVIGATION =====
function navigateToPage(pageId) {
    pages.forEach(page => page.classList.remove('active'));

    const selectedPage = document.getElementById(pageId);
    if (selectedPage) {
        selectedPage.classList.add('active');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    navItems.forEach(item => item.classList.remove('active'));
    const activeNavItem = document.querySelector(`[data-page="${pageId}"]`);
    if (activeNavItem) activeNavItem.classList.add('active');

    closeMobileMenu();

    resetPageReveals(pageId);
    setTimeout(checkReveals, 60);
}

// Support inline onclick="show(e, 'pageId')" calls
function show(e, pageId) {
    navigateToPage(pageId);
    if (e && e.target) {
        navItems.forEach(i => i.classList.remove('active'));
        e.target.classList.add('active');
    }
}

// data-page attribute clicks
navItems.forEach(item => {
    item.addEventListener('click', (e) => {
        e.preventDefault();
        const pageId = item.getAttribute('data-page');
        if (pageId) navigateToPage(pageId);
    });
});

// ===== SCROLL REVEAL =====
const REVEAL_MAP = [
    ['.about-section-block',  null,           true],
    ['.sidebar-fact',         'reveal-left',  true],
    ['.about-life-sentence',  'reveal-scale', false],
    ['.book-card',            'reveal-scale', true],
    ['.video-card',           null,           true],
    ['.gallery-item',         'reveal-scale', true],
    ['.stat',                 'reveal-scale', true],
    ['.a-stat',               'reveal-scale', true],
    ['.contact-item',         null,           true],
    ['.form-group',           'reveal-left',  true],
    ['.footer-section',       null,           true],
    ['.amazon-badge',         'reveal-scale', false],
    ['.about-quote',          'reveal-left',  false],
    ['.about-portrait',       'reveal-scale', false],
    ['.author-image-frame',   'reveal-scale', false],
    ['.book-cover',           null,           false],
    ['.book-info',            null,           false],
    ['.video-info',           null,           true],
    ['.video-thumbnail',      'reveal-scale', true],
    ['.showcase-text p',      null,           true],
    ['.showcase-text h3',     null,           false],
    ['.showcase-image',       'reveal-left',  false],
    ['.author-bio',           null,           false],
    ['.author-tagline',       null,           false],
    ['.author-info h4',       null,           false],
    ['.author-info h2',       null,           false],
    ['.author-stats',         null,           false],
    ['.section-header',       null,           false],
    ['.section-eyebrow',      null,           false],
    ['.section-rule',         null,           false],
    ['.section-subtitle',     null,           false],
    ['.section-title',        null,           false],
    ['.book-category',        null,           false],
    ['.book-title',           null,           false],
    ['.book-description',     null,           false],
    ['.book-rating',          null,           false],
    ['.book-footer',          null,           false],
    ['.video-title',          null,           false],
    ['.video-date',           null,           false],
    ['.video-desc',           null,           false],
    ['.contact-label',        null,           false],
    ['.contact-value',        null,           false],
    ['.contact-icon',         'reveal-scale', true],
    ['.gallery-img',          'reveal-scale', true],
    ['.footer-bottom',        null,           false],
];

function setupReveals() {
    REVEAL_MAP.forEach(([sel, cls, stagger]) => {
        document.querySelectorAll(sel).forEach((el, i) => {
            if (!el.classList.contains('reveal')) el.classList.add('reveal');
            if (cls && !el.classList.contains(cls)) el.classList.add(cls);
            if (stagger) {
                el.classList.remove('reveal-delay-1','reveal-delay-2','reveal-delay-3','reveal-delay-4','reveal-delay-5','reveal-delay-6');
                el.classList.add('reveal-delay-' + ((i % 6) + 1));
            }
        });
    });
}

function resetPageReveals(pageId) {
    const pg = document.getElementById(pageId);
    if (pg) pg.querySelectorAll('.reveal').forEach(el => el.classList.remove('visible'));
}

function checkReveals() {
    document.querySelectorAll('.page.active .reveal:not(.visible), footer .reveal:not(.visible)').forEach(el => {
        if (el.getBoundingClientRect().top < window.innerHeight * 0.93) {
            el.classList.add('visible');
        }
    });
}

setupReveals();
checkReveals();

// ===== CONTACT FORM =====
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const name    = document.getElementById('name').value;
        const email   = document.getElementById('email').value;
        const subject = document.getElementById('subject').value;
        const message = document.getElementById('message').value;
        const gmailSubject = `New Contact Form Submission: ${subject}`;
        const gmailBody    = `From: ${name} (${email})\n\nMessage:\n${message}`;
        const gmailLink    = `https://mail.google.com/mail/u/0/?view=cm&fs=1&to=jussabellejumag13@gmail.com&su=${encodeURIComponent(gmailSubject)}&body=${encodeURIComponent(gmailBody)}`;
        window.open(gmailLink, '_blank');
        this.reset();
        alert('Opening Gmail... Your message details have been prepared. Please complete sending in your Gmail inbox.');
    });
}

// ===== SMOOTH SCROLL for anchor links =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href !== '#' && !href.includes('data-page')) {
            e.preventDefault();
        }
    });
});