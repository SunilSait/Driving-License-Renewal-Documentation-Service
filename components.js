/* ===== DRIVESURE — DRIVING LICENSE RENEWAL & DOCUMENTATION SERVICE ===== */
/* Shared Components v1.0 */
'use strict';

/* ─── THEME & DIRECTION (runs immediately before DOM) ───────── */
(function initThemeDir() {
    const html = document.documentElement;
    const savedTheme = localStorage.getItem('ds_theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) html.classList.add('dark');
    if (localStorage.getItem('ds_dir') === 'rtl') html.setAttribute('dir', 'rtl');

    // Clean up temporary palette storage and lock in Royal Blue & Indigo theme
    localStorage.removeItem('ds_color_palette');
    localStorage.removeItem('ds_palette_version');
    const root = document.documentElement;
    root.style.setProperty('--primary', '#1E40AF');
    root.style.setProperty('--primary-hover', '#1D4ED8');
    root.style.setProperty('--primary-light', '#EFF6FF');
    root.style.setProperty('--primary-subtle', 'rgba(30, 64, 175, 0.08)');
    root.style.setProperty('--primary-glow', 'rgba(30, 64, 175, 0.25)');
    root.style.setProperty('--secondary', '#4F46E5');
    root.style.setProperty('--secondary-hover', '#4338CA');
    root.style.setProperty('--secondary-light', '#EEF2FF');
    root.style.setProperty('--secondary-glow', 'rgba(79, 70, 229, 0.25)');
})();

/* ─── THEME TOGGLE ─────────────────────────────────────────── */
function toggleTheme() {
    const html = document.documentElement;
    html.classList.toggle('dark');
    localStorage.setItem('ds_theme', html.classList.contains('dark') ? 'dark' : 'light');
    document.querySelectorAll('.theme-icon').forEach(updateThemeIcon);
}

function updateThemeIcon(el) {
    if (!el) return;
    const isDark = document.documentElement.classList.contains('dark');
    el.className = isDark ? 'fas fa-sun theme-icon' : 'fas fa-moon theme-icon';
}

/* ─── DIRECTION TOGGLE ─────────────────────────────────────── */
function toggleDir() {
    const html = document.documentElement;
    const isRTL = html.getAttribute('dir') === 'rtl';
    html.setAttribute('dir', isRTL ? 'ltr' : 'rtl');
    localStorage.setItem('ds_dir', isRTL ? 'ltr' : 'rtl');
    document.querySelectorAll('.dir-label').forEach(el => {
        el.textContent = isRTL ? 'LTR' : 'RTL';
    });
}

/* ─── LOGO HTML ─────────────────────────────────────────────── */
function getLogoHTML(size = 38) {
    return `<img src="logo.svg" alt="DriveSure Logo" width="${size}" height="${size}" class="nav-logo-img" />`;
}

/* ─── INJECT NAVBAR ─────────────────────────────────────────── */
function injectNav() {
    const el = document.getElementById('main-nav');
    if (!el) return;

    const page = location.pathname.split('/').pop() || 'index.html';
    const isDark = document.documentElement.classList.contains('dark');
    const isRTL = document.documentElement.getAttribute('dir') === 'rtl';

    const links = [
        { href: 'index.html',     label: 'Home' },
        { href: 'home2.html',     label: 'Home 2' },
        { href: 'services.html',  label: 'Services' },
        { href: 'documents.html', label: 'Documents' },
        { href: 'fees.html',      label: 'Fees & Time' },
        { href: 'contact.html',   label: 'Contact' },
    ];

    const navLinksHTML = links.map(l => {
        const isActive = page === l.href || (page === '' && l.href === 'index.html');
        return `<a href="${l.href}" class="nav-link${isActive ? ' active' : ''}">${l.label}</a>`;
    }).join('');

    const mobileLinksHTML = links.map(l => {
        const isActive = page === l.href || (page === '' && l.href === 'index.html');
        return `<a href="${l.href}" class="mob-link${isActive ? ' active' : ''}">${l.label}</a>`;
    }).join('');

    el.innerHTML = `
    <nav class="navbar" id="navbar">
        <div class="nav-inner">
            <!-- Logo -->
            <a href="index.html" class="nav-logo" aria-label="DriveSure Home">
                ${getLogoHTML(38)}
                <div class="nav-logo-text">
                    <span class="brand-top">DriveSure</span>
                    <span class="brand-bottom">License & Documentation</span>
                </div>
            </a>

            <!-- Desktop Links -->
            <div class="nav-links" id="nav-links">
                ${navLinksHTML}
            </div>

            <!-- Right Actions -->
            <div class="nav-actions">
                <button onclick="toggleDir()" class="nav-icon-btn" title="Toggle Direction" aria-label="Toggle RTL/LTR">
                    <span class="dir-label">${isRTL ? 'RTL' : 'LTR'}</span>
                </button>
                <button onclick="toggleTheme()" class="nav-icon-btn" title="Toggle Theme" aria-label="Toggle dark mode">
                    <i class="${isDark ? 'fas fa-sun theme-icon' : 'fas fa-moon theme-icon'}"></i>
                </button>
                <a href="login.html" class="btn btn-secondary btn-sm">Login</a>
                <a href="contact.html" class="btn btn-primary btn-sm">Book Now</a>
                <button class="mobile-menu-btn" id="mobile-menu-toggle" onclick="toggleMobileMenu()" aria-label="Open menu">
                    <i class="fas fa-bars mobile-menu-icon"></i>
                </button>
            </div>
        </div>

        <!-- Mobile Backdrop -->
        <div class="mobile-backdrop" id="mobile-backdrop" onclick="toggleMobileMenu()"></div>

        <!-- Mobile Menu -->
        <div class="mobile-menu" id="mobile-menu" role="navigation" aria-label="Mobile Navigation">
            ${mobileLinksHTML}
            <div class="mob-actions">
                <a href="login.html" class="btn btn-secondary w-full">Login</a>
                <a href="contact.html" class="btn btn-primary w-full">Book Appointment</a>
            </div>
            <div class="mob-toggles">
                <button onclick="toggleDir()" class="nav-icon-btn" title="Toggle Direction">
                    <span class="dir-label">${isRTL ? 'RTL' : 'LTR'}</span>
                </button>
                <button onclick="toggleTheme()" class="nav-icon-btn" title="Toggle Theme">
                    <i class="${isDark ? 'fas fa-sun theme-icon' : 'fas fa-moon theme-icon'}"></i>
                </button>
            </div>
        </div>
    </nav>
    <div class="navbar-spacer"></div>`;
}

/* ─── MOBILE MENU TOGGLE ────────────────────────────────────── */
function toggleMobileMenu() {
    const menu = document.getElementById('mobile-menu');
    const backdrop = document.getElementById('mobile-backdrop');
    const icon = document.querySelector('.mobile-menu-icon');
    if (!menu) return;

    const isOpen = menu.classList.contains('open');
    if (isOpen) {
        menu.classList.remove('open');
        if (backdrop) backdrop.classList.remove('open');
        if (icon) { icon.className = 'fas fa-bars mobile-menu-icon'; }
    } else {
        menu.classList.add('open');
        if (backdrop) backdrop.classList.add('open');
        if (icon) { icon.className = 'fas fa-xmark mobile-menu-icon'; }
    }
}

/* Close mobile menu on outside click */
document.addEventListener('click', function(e) {
    const menu = document.getElementById('mobile-menu');
    const backdrop = document.getElementById('mobile-backdrop');
    const btn = document.getElementById('mobile-menu-toggle');
    if (menu && menu.classList.contains('open') && !menu.contains(e.target) && btn && !btn.contains(e.target)) {
        menu.classList.remove('open');
        if (backdrop) backdrop.classList.remove('open');
        const icon = document.querySelector('.mobile-menu-icon');
        if (icon) icon.className = 'fas fa-bars mobile-menu-icon';
    }
});

/* ─── INJECT FOOTER ─────────────────────────────────────────── */
function injectFooter() {
    const el = document.getElementById('main-footer');
    if (!el) return;

    el.innerHTML = `
    <footer class="footer">
        <div class="container">
            <div class="footer-grid">
                <!-- Brand Column -->
                <div class="footer-brand">
                    <a href="index.html" class="nav-logo" style="margin-bottom:0.75rem;" aria-label="DriveSure Home">
                        ${getLogoHTML(38)}
                        <div class="nav-logo-text">
                            <span class="brand-top">DriveSure</span>
                            <span class="brand-bottom">License & Documentation</span>
                        </div>
                    </a>
                    <p>Your trusted partner for driving license renewal, address changes, RC renewal, and international driving permit assistance. Fast, reliable, and hassle-free.</p>
                    <div class="footer-socials">
                        <a href="#" class="footer-social-link" aria-label="Facebook"><i class="fab fa-facebook-f"></i></a>
                        <a href="#" class="footer-social-link" aria-label="Instagram"><i class="fab fa-instagram"></i></a>
                        <a href="#" class="footer-social-link" aria-label="YouTube"><i class="fab fa-youtube"></i></a>
                        <a href="#" class="footer-social-link" aria-label="WhatsApp"><i class="fab fa-whatsapp"></i></a>
                    </div>
                </div>

                <!-- Quick Links -->
                <div>
                    <h4 class="footer-col-title">Quick Links</h4>
                    <ul class="footer-links">
                        <li><a href="index.html">Home</a></li>
                        <li><a href="home2.html">Home 2 — Premium</a></li>
                        <li><a href="services.html">Our Services</a></li>
                        <li><a href="documents.html">Documents Required</a></li>
                        <li><a href="fees.html">Fees & Processing Time</a></li>
                        <li><a href="contact.html">Contact Us</a></li>
                    </ul>
                </div>

                <!-- Resources -->
                <div>
                    <h4 class="footer-col-title">Resources</h4>
                    <ul class="footer-links">
                        <li><a href="coming-soon.html">Blog & Guides</a></li>
                        <li><a href="coming-soon.html">Careers</a></li>
                        <li><a href="login.html">Login</a></li>
                        <li><a href="signup.html">Sign Up</a></li>
                        <li><a href="404.html">404 Page</a></li>
                        <li><a href="coming-soon.html">Coming Soon</a></li>
                    </ul>
                </div>

                <!-- Newsletter -->
                <div>
                    <div class="footer-newsletter">
                        <h4>Stay Updated</h4>
                        <p>Get renewal reminders, document tips & exclusive offers in your inbox.</p>
                        <form class="footer-newsletter-form" onsubmit="event.preventDefault(); this.querySelector('input').value=''; alert('Subscribed successfully!');">
                            <input type="email" placeholder="your@email.com" class="footer-newsletter-input" required>
                            <button type="submit" class="footer-newsletter-btn">Subscribe</button>
                        </form>
                    </div>
                </div>
            </div>

            <!-- Bottom Bar -->
            <div class="footer-bottom">
                <p>&copy; ${new Date().getFullYear()} DriveSure. All rights reserved.</p>
                <div class="footer-bottom-links">
                    <a href="#">Privacy Policy</a>
                    <a href="#">Terms of Service</a>
                    <a href="#">Cookie Policy</a>
                </div>
            </div>
        </div>
    </footer>`;
}

/* ─── SCROLL TO TOP ─────────────────────────────────────────── */
function injectScrollToTop() {
    if (document.body.classList.contains('auth-page') || document.body.classList.contains('fullscreen-page')) return;
    if (document.getElementById('scroll-to-top')) return;

    const btn = document.createElement('button');
    btn.id = 'scroll-to-top';
    btn.className = 'scroll-to-top-btn';
    btn.setAttribute('aria-label', 'Scroll to top');
    btn.title = 'Scroll to top';
    btn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    btn.onclick = () => window.scrollTo({ top: 0, behavior: 'smooth' });
    document.body.appendChild(btn);

    window.addEventListener('scroll', () => {
        btn.classList.toggle('visible', window.scrollY > 280);
    }, { passive: true });
}

/* ─── NAVBAR SCROLL EFFECT ─────────────────────────────────── */
window.addEventListener('scroll', function () {
    const nav = document.getElementById('navbar');
    if (nav) nav.classList.toggle('scrolled', window.scrollY > 15);
}, { passive: true });

/* ─── SCROLL ANIMATIONS ─────────────────────────────────────── */
function initScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('.animate-on-scroll').forEach(el => observer.observe(el));
}

/* ─── COUNTER ANIMATION ─────────────────────────────────────── */
function animateCounters() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const target = parseInt(el.getAttribute('data-count'));
                const suffix = el.getAttribute('data-suffix') || '';
                const prefix = el.getAttribute('data-prefix') || '';
                let current = 0;
                const duration = 1800;
                const steps = 60;
                const increment = target / steps;
                const interval = duration / steps;

                const timer = setInterval(() => {
                    current += increment;
                    if (current >= target) {
                        current = target;
                        clearInterval(timer);
                    }
                    el.textContent = prefix + Math.floor(current).toLocaleString() + suffix;
                }, interval);

                observer.unobserve(el);
            }
        });
    }, { threshold: 0.3 });

    document.querySelectorAll('[data-count]').forEach(el => observer.observe(el));
}

/* ─── FAQ TOGGLE ─────────────────────────────────────────────── */
function toggleFAQ(triggerEl) {
    const item = triggerEl.closest('.faq-item');
    const wasActive = item.classList.contains('active');
    document.querySelectorAll('.faq-item.active').forEach(f => f.classList.remove('active'));
    if (!wasActive) item.classList.add('active');
}

/* ─── DOC TAB SYSTEM ─────────────────────────────────────────── */
function switchDocTab(tabId) {
    document.querySelectorAll('.doc-tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.doc-panel').forEach(panel => panel.classList.remove('active'));

    const btn = document.querySelector(`.doc-tab-btn[data-tab="${tabId}"]`);
    const panel = document.getElementById(tabId);
    if (btn) btn.classList.add('active');
    if (panel) panel.classList.add('active');
}

/* ─── AUTH PAGE INIT ─────────────────────────────────────────── */
function initAuthPage() {
    const html = document.documentElement;
    const savedTheme = localStorage.getItem('ds_theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) html.classList.add('dark');
    if (localStorage.getItem('ds_dir') === 'rtl') html.setAttribute('dir', 'rtl');

    document.querySelectorAll('.theme-icon').forEach(updateThemeIcon);
    document.querySelectorAll('.dir-label').forEach(el => {
        el.textContent = html.getAttribute('dir') === 'rtl' ? 'RTL' : 'LTR';
    });
}

/* ─── PASSWORD VISIBILITY TOGGLE ────────────────────────────── */
function togglePasswordVisibility(inputId, iconEl) {
    const input = document.getElementById(inputId);
    if (!input) return;
    if (input.type === 'password') {
        input.type = 'text';
        iconEl.className = 'fas fa-eye-slash';
    } else {
        input.type = 'password';
        iconEl.className = 'fas fa-eye';
    }
}

/* ─── COUNTDOWN TIMER (Coming Soon) ─────────────────────────── */
function initCountdown(targetDate) {
    function update() {
        const now = new Date().getTime();
        const distance = targetDate - now;

        if (distance < 0) {
            document.querySelectorAll('.countdown-num').forEach(el => el.textContent = '00');
            return;
        }

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        const pad = n => String(n).padStart(2, '0');
        const [dEl, hEl, mEl, sEl] = document.querySelectorAll('.countdown-num');
        if (dEl) dEl.textContent = pad(days);
        if (hEl) hEl.textContent = pad(hours);
        if (mEl) mEl.textContent = pad(minutes);
        if (sEl) sEl.textContent = pad(seconds);
    }

    update();
    setInterval(update, 1000);
}

/* ─── INSTANT CALCULATOR LOGIC ────────────────────────────────── */
let currentService = 'renewal';
let currentCategory = 'mcwg';
let currentExpiry = 'normal';

const calcData = {
    renewal: {
        baseFee: 750,
        turnaround: '3–5 Working Days',
        docs: [
            'Original Driving License & Self-Attested Copy',
            'Form 9 Application for License Renewal',
            'Form 1-A Medical Fitness Certificate',
            'Aadhaar Card Address Proof'
        ]
    },
    address: {
        baseFee: 600,
        turnaround: '2–4 Working Days',
        docs: [
            'Original Driving License',
            'Form 33 Address Modification Request',
            'New Address Proof (Aadhaar / Passport / Utility Bill)',
            'Passport-size Photograph'
        ]
    },
    idp: {
        baseFee: 1800,
        turnaround: '24–48 Hours',
        docs: [
            'Valid Indian Driving License (Original)',
            'Valid Passport & Active Visa Copies',
            'Air Ticket Copy (Flight Reservation)',
            'Form 4-A Medical & IDP Application'
        ]
    },
    rc: {
        baseFee: 1250,
        turnaround: '4–6 Working Days',
        docs: [
            'Original Vehicle RC Smart Card',
            'Valid Pollution Under Control (PUC) Certificate',
            'Valid Vehicle Insurance Policy',
            'Form 25 Application for Registration Renewal'
        ]
    }
};

function renderCalculatorResult() {
    const data = calcData[currentService];
    let price = data.baseFee;

    if (currentCategory === 'lmv') price += 200;
    if (currentCategory === 'commercial') price += 500;
    if (currentExpiry === 'grace') price += 350;

    ['calc-total-price', 'calc-total-price-h2'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.textContent = '₹' + price;
    });

    ['calc-turnaround-badge', 'calc-turnaround-badge-h2'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.innerHTML = '<i class="fas fa-bolt"></i> ' + data.turnaround;
    });

    ['calc-docs-list', 'calc-docs-list-h2'].forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            el.innerHTML = data.docs.map(doc => `<div class="calc-doc-item"><i class="fas fa-circle-check"></i> ${doc}</div>`).join('');
        }
    });
}

window.updateCalculator = function (service, btn) {
    currentService = service;
    if (btn && btn.parentElement) {
        btn.parentElement.querySelectorAll('.calc-pill').forEach(p => p.classList.remove('active'));
        btn.classList.add('active');
    }
    renderCalculatorResult();
};

window.updateVehicleCategory = function (cat, btn) {
    currentCategory = cat;
    if (btn && btn.parentElement) {
        btn.parentElement.querySelectorAll('.calc-pill').forEach(p => p.classList.remove('active'));
        btn.classList.add('active');
    }
    renderCalculatorResult();
};

window.updateExpiryStatus = function (status, btn) {
    currentExpiry = status;
    if (btn && btn.parentElement) {
        btn.parentElement.querySelectorAll('.calc-pill').forEach(p => p.classList.remove('active'));
        btn.classList.add('active');
    }
    renderCalculatorResult();
};

/* ─── LIVE TRACKER DEMO LOGIC ─────────────────────────────────── */
const trackerDemoData = {
    'TN-DL-8429': [
        { title: 'Document Audit', status: 'Passed 100% Audit', done: true },
        { title: 'RTO Counter Filing', status: 'Filed at TN-01 Counter', done: true },
        { title: 'Smart Card Issue', status: 'Approval In-Progress', active: true },
        { title: 'Speed Post Dispatch', status: 'Pending Dispatch', done: false }
    ],
    'TN-IDP-5521': [
        { title: 'Document Audit', status: 'Passport Verified', done: true },
        { title: 'Embassies & RTO Liaison', status: 'IDP Approved', done: true },
        { title: 'Permit Printing', status: 'Issued & Stamped', done: true },
        { title: 'Doorstep Courier', status: 'In Transit (SpeedPost #TN982)', active: true }
    ],
    'TN-RC-1042': [
        { title: 'PUC & Insurance Check', status: 'Verified Valid', done: true },
        { title: 'Vehicle Inspection', status: 'Fitness Passed', done: true },
        { title: 'RC Renewal Filing', status: 'Under RTO Review', active: true },
        { title: 'Smart Card Delivery', status: 'Scheduled', done: false }
    ]
};

window.simulateTrackSearch = function () {
    const input = document.getElementById('tracker-input-field') || document.getElementById('tracker-input-field-h2');
    const containers = document.querySelectorAll('.tracker-flow');
    if (!input || !containers.length) return;

    const val = input.value.trim().toUpperCase();
    const data = trackerDemoData[val] || [
        { title: 'Application Received', status: 'Logged in Database', done: true },
        { title: 'Document Audit', status: 'Initial Check Passed', done: true },
        { title: 'RTO Filing', status: 'In Progress at Liaison Counter', active: true },
        { title: 'Dispatch', status: 'Scheduled via Speed Post', done: false }
    ];

    const html = data.map(item => {
        let cls = 'tracker-step-item';
        let icon = '<i class="fas fa-circle"></i>';
        if (item.done) {
            cls += ' done';
            icon = '<i class="fas fa-check"></i>';
        } else if (item.active) {
            cls += ' active-step';
            icon = '<i class="fas fa-spinner fa-spin"></i>';
        }
        return `
            <div class="${cls}">
                <div class="tracker-step-icon">${icon}</div>
                <div class="tracker-step-title">${item.title}</div>
                <div class="tracker-step-status">${item.status}</div>
            </div>
        `;
    }).join('');

    containers.forEach(c => c.innerHTML = html);
};

window.setTrackerSample = function (code) {
    ['tracker-input-field', 'tracker-input-field-h2'].forEach(id => {
        const input = document.getElementById(id);
        if (input) input.value = code;
    });
    simulateTrackSearch();
};

window.filterRtoForms = function(category, btn) {
    const filterBtns = document.querySelectorAll('.forms-filter-btn');
    filterBtns.forEach(b => b.classList.remove('active'));
    if (btn) btn.classList.add('active');

    const formCards = document.querySelectorAll('.form-card');
    formCards.forEach(card => {
        if (category === 'all' || card.getAttribute('data-category') === category) {
            card.style.display = 'flex';
        } else {
            card.style.display = 'none';
        }
    });
};

window.previewRtoForm = function(title, details) {
    alert(title + '\n\n' + details + '\n\nClick Download to save the official PDF template to your device.');
};

/* ─── DOM READY INIT ─────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', function () {
    injectNav();
    injectFooter();
    injectScrollToTop();
    initScrollAnimations();
    animateCounters();
});
