// -- orion.js - Core Library (Expanded + Fixes) --
// ----------------------------------------------
(function() {
    'use strict';

    const qs = (sel, root = document) => root.querySelector(sel);
    const qsa = (sel, root = document) => Array.from(root.querySelectorAll(sel));

    const clamp = (n, min, max) => Math.min(max, Math.max(min, n));

    const orion = {
        init: function() {
            console.log('Orion UI Library initialized. B&W Theme is active.');
            this.addRippleEffect();
            this.initializeProgressBars();
            this.initializeRadialProgress();
            this.initializeModals();
            this.initializeToasts();
            this.initializeDropdowns();
            this.initializeAccordions();
            this.initializeTabs();
            this.initializeMatrixGrid();
            this.initializeCodeTerminal();
            this.initializeCopyButtons();
            this.initializeSidebar();
            this.initializeCarousel();
            this.initializeChips();
            this.initializeTooltips();
            this.initializePagination();
            this.initializeRanges(); // NEW: Range slider fix + enhancements
            this.initializeDrawer(); // NEW: Drawer component
            this.initializeLoadingButtons(); // NEW: Loading state helper
            this.bindShortcuts();
        },

        // Ripple effect on clicks
        addRippleEffect: function() {
            const rippleElements = document.querySelectorAll('.orion-btn, .orion-ripple');
            rippleElements.forEach(el => {
                el.addEventListener('click', function(e) {
                    const rect = el.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const y = e.clientY - rect.top;

                    const ripple = document.createElement('span');
                    ripple.classList.add('orion-ripple-effect');
                    ripple.style.left = `${x}px`;
                    ripple.style.top = `${y}px`;

                    this.appendChild(ripple);

                    setTimeout(() => ripple.remove(), 600);
                });
            });
        },

        // Linear progress bars
        initializeProgressBars: function() {
            qsa('.orion-progress-bar').forEach(bar => {
                const value = Number(bar.getAttribute('data-value')) || 0;
                bar.style.width = `${Math.min(100, Math.max(0, value))}%`;
            });
        },

        // Radial Progress
        initializeRadialProgress: function() {
            qsa('.orion-progress-circle').forEach(circle => {
                const value = Number(circle.getAttribute('data-value')) || 0;
                const size = Number(getComputedStyle(circle).getPropertyValue('--size').replace('px','')) || 72;
                const stroke = 6;
                const r = (size/2) - stroke;
                const c = 2 * Math.PI * r;
                circle.innerHTML = `
                    <svg width="${size}" height="${size}">
                        <circle class="track" cx="${size/2}" cy="${size/2}" r="${r}" stroke-width="${stroke}" fill="none" />
                        <circle class="fill" cx="${size/2}" cy="${size/2}" r="${r}" stroke-width="${stroke}" fill="none" stroke-dasharray="${c}" stroke-dashoffset="${c}" />
                    </svg>
                    <div class="label">${value}%</div>`;
                requestAnimationFrame(() => {
                    const fill = circle.querySelector('.fill');
                    const offset = c - (value/100) * c;
                    fill.style.strokeDashoffset = `${offset}`;
                });
            });
        },

        // Modal functionality
        initializeModals: function() {
            const modalBtns = qsa('[data-modal-target]');
            const modals = qsa('.orion-modal');
            const closeBtns = qsa('.orion-modal-close');

            modalBtns.forEach(btn => {
                btn.addEventListener('click', () => {
                    const target = btn.getAttribute('data-modal-target');
                    const modal = qs(target);
                    if (modal) modal.style.display = 'block';
                });
            });

            closeBtns.forEach(btn => {
                btn.addEventListener('click', () => {
                    const modal = btn.closest('.orion-modal');
                    if (modal) modal.style.display = 'none';
                });
            });

            window.addEventListener('click', (e) => {
                modals.forEach(modal => { if (e.target === modal) modal.style.display = 'none'; });
            });
        },

        // Toasts
        initializeToasts: function() {
            qsa('[data-toast-message]').forEach(btn => {
                btn.addEventListener('click', () => {
                    const message = btn.getAttribute('data-toast-message');
                    const type = btn.getAttribute('data-toast-type');
                    this.showToast(message, type);
                });
            });
        },
        showToast: function(message, type = 'info') {
            let container = qs('#orion-toast-container');
            if (!container) {
                container = document.createElement('div');
                container.id = 'orion-toast-container';
                document.body.appendChild(container);
            }
            const toast = document.createElement('div');
            toast.className = `orion-toast orion-toast--${type}`;
            toast.textContent = message;
            container.appendChild(toast);
            setTimeout(() => toast.remove(), 3000);
        },

        // Dropdowns
        initializeDropdowns: function() {
            qsa('.orion-dropdown').forEach(dropdown => {
                const btn = dropdown.querySelector('.orion-btn');
                const content = dropdown.querySelector('.orion-dropdown-content');
                btn?.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const open = content.style.display === 'block';
                    qsa('.orion-dropdown-content').forEach(c => c.style.display = 'none');
                    content.style.display = open ? 'none' : 'block';
                });
                document.addEventListener('click', (e) => { if (!dropdown.contains(e.target)) content.style.display = 'none'; });
            });
        },

        // Accordions
        initializeAccordions: function() {
            qsa('.orion-accordion-header').forEach(header => {
                header.addEventListener('click', () => {
                    const content = header.nextElementSibling;
                    const isExpanded = content.style.maxHeight;
                    qsa('.orion-accordion-content').forEach(c => c.style.maxHeight = null);
                    if (!isExpanded) content.style.maxHeight = content.scrollHeight + 'px';
                });
            });
        },

        // Tabs
        initializeTabs: function() {
            qsa('.orion-tabs').forEach(container => {
                qsa('.orion-tab-header', container).forEach(header => {
                    header.addEventListener('click', () => {
                        qsa('.orion-tab-header', container).forEach(h => h.classList.remove('orion-active-tab'));
                        qsa('.orion-tab-content', container).forEach(c => c.classList.remove('orion-active-content'));
                        header.classList.add('orion-active-tab');
                        const targetId = header.getAttribute('data-tab');
                        qs('#' + targetId)?.classList.add('orion-active-content');
                    });
                });
            });
        },

        // Matrix Grid
        initializeMatrixGrid: function() {
            const grid = qs('#orion-matrix-grid');
            if (!grid) return;
            const size = 500;
            for (let i = 0; i < size; i++) {
                const cell = document.createElement('div');
                cell.classList.add('matrix-cell');
                cell.textContent = Math.random() < 0.5 ? '0' : '1';
                grid.appendChild(cell);
            }
            setInterval(() => {
                const cells = qsa('.matrix-cell');
                const randomCell = cells[Math.floor(Math.random() * cells.length)];
                if (!randomCell) return;
                randomCell.classList.add('active');
                setTimeout(() => randomCell.classList.remove('active'), 2000);
            }, 50);
        },

        // Code Terminal
        initializeCodeTerminal: function() {
            const terminal = qs('#orion-terminal-output');
            if (!terminal) return;
            const commands = [
                'orion_os> Initializing core systems...',
                'orion_os> Connecting to remote server...',
                'orion_os> Authentication successful.',
                'orion_os> Loading starship telemetry...',
                'orion_os> System check complete. All systems online.',
                'orion_os> Awaiting next command...',
            ];
            let commandIndex = 0;
            let charIndex = 0;

            const typeCommand = () => {
                if (commandIndex < commands.length) {
                    const current = commands[commandIndex];
                    if (charIndex <= current.length) {
                        terminal.textContent = current.substring(0, charIndex) + '|';
                        charIndex++;
                        setTimeout(typeCommand, 50);
                    } else {
                        terminal.textContent = current;
                        charIndex = 0;
                        commandIndex++;
                        setTimeout(typeCommand, 1600);
                    }
                } else {
                    commandIndex = 0; typeCommand();
                }
            };
            typeCommand();
        },

        // Copy buttons for code blocks
        initializeCopyButtons: function() {
            qsa('pre').forEach(pre => {
                if (pre.querySelector('.orion-copy-btn')) return;
                const btn = document.createElement('button');
                btn.className = 'orion-copy-btn';
                btn.textContent = 'Copy';
                btn.addEventListener('click', async () => {
                    const text = pre.innerText.replace(/^Copy$/m, '').trim();
                    try {
                        await navigator.clipboard.writeText(text);
                        this.showToast('Copied to clipboard', 'success');
                    } catch {
                        this.showToast('Copy failed', 'error');
                    }
                });
                pre.appendChild(btn);
            });
        },

        // Sidebar demo
        initializeSidebar: function() {
            const toggle = qs('[data-sidebar-toggle]');
            const sidebar = qs('.orion-sidebar');
            toggle?.addEventListener('click', () => sidebar?.classList.toggle('open'));
        },

        // Carousel
        initializeCarousel: function() {
            const carousels = qsa('.orion-carousel');
            carousels.forEach(carousel => {
                const track = carousel.querySelector('.orion-carousel-track');
                const slides = qsa('.orion-carousel-slide', track);
                const prev = carousel.querySelector('[data-carousel-prev]');
                const next = carousel.querySelector('[data-carousel-next]');
                const dotsContainer = carousel.querySelector('.orion-carousel-dots');
                let index = 0;

                const renderDots = () => {
                    if (!dotsContainer) return;
                    dotsContainer.innerHTML = '';
                    slides.forEach((_, i) => {
                        const dot = document.createElement('div');
                        dot.className = 'orion-carousel-dot' + (i === index ? ' active' : '');
                        dot.addEventListener('click', () => goTo(i));
                        dotsContainer.appendChild(dot);
                    });
                };

                const goTo = (i) => {
                    index = (i + slides.length) % slides.length;
                    track.style.transform = `translateX(-${index * 100}%)`;
                    renderDots();
                };

                prev?.addEventListener('click', () => goTo(index - 1));
                next?.addEventListener('click', () => goTo(index + 1));
                renderDots();
            });
        },

        // Chips
        initializeChips: function() {
            qsa('.orion-chip .close').forEach(close => {
                close.addEventListener('click', () => close.closest('.orion-chip')?.remove());
            });
        },

        // Tooltips helper (for dynamic content if needed)
        initializeTooltips: function() {
            // Pure CSS handles hover. This stub remains for future dynamic logic.
        },

        // Pagination demo
        initializePagination: function() {
            qsa('[data-pagination]').forEach(container => {
                let page = 1;
                const total = Number(container.getAttribute('data-total')) || 5;
                const onChange = () => {
                    qsa('.orion-page', container).forEach((p, i) => p.classList.toggle('active', i+1 === page));
                };
                container.addEventListener('click', (e) => {
                    const t = e.target.closest('.orion-page');
                    if (!t) return;
                    const idx = Number(t.getAttribute('data-page'));
                    if (!isNaN(idx)) { page = clamp(idx, 1, total); onChange(); }
                });
                // init
                onChange();
            });
        },

        // Range sliders: cross-browser styles + fill + bubble label
        initializeRanges: function() {
            const update = (input, bubble) => {
                const min = Number(input.min || 0);
                const max = Number(input.max || 100);
                const val = Number(input.value || min);
                const pct = (val - min) * 100 / (max - min || 1);
                // background fill
                const fillColor = getComputedStyle(input).getPropertyValue('--orion-primary') || '#f0f0f0';
                const trackColor = 'rgba(255, 255, 255, 0.08)';
                input.style.background = `linear-gradient(to right, ${fillColor} ${pct}%, ${trackColor} ${pct}%)`;
                // bubble
                if (bubble) {
                    bubble.textContent = String(val);
                    const bounds = input.getBoundingClientRect();
                    const x = bounds.left + (pct / 100) * bounds.width;
                    const parentLeft = input.parentElement.getBoundingClientRect().left;
                    bubble.style.left = `${x - parentLeft}px`;
                }
            };

            qsa('input[type="range"]').forEach(input => {
                // wrap once
                if (!input.parentElement.classList.contains('orion-range-wrap')) {
                    const wrap = document.createElement('div');
                    wrap.className = 'orion-range-wrap';
                    input.parentElement.insertBefore(wrap, input);
                    wrap.appendChild(input);
                }
                // bubble opt-in: add data-bubble or default true for preview
                const useBubble = input.hasAttribute('data-bubble') || input.closest('.orion-component-example');
                let bubble;
                if (useBubble) {
                    bubble = document.createElement('span');
                    bubble.className = 'orion-range-bubble';
                    input.after(bubble);
                }
                const onInput = () => update(input, bubble);
                input.addEventListener('input', onInput);
                input.addEventListener('change', onInput);
                window.addEventListener('resize', onInput);
                onInput();
            });
        },

        // Drawer (off-canvas panel)
        initializeDrawer: function() {
            const body = document.body;
            const openers = qsa('[data-drawer-open]');
            const closers = qsa('[data-drawer-close]');

            const open = (sel) => {
                const dr = qs(sel);
                if (!dr) return;
                dr.classList.add('open');
                body.classList.add('orion-drawer-open');
            };
            const close = (dr) => {
                dr.classList.remove('open');
                body.classList.remove('orion-drawer-open');
            };

            openers.forEach(btn => btn.addEventListener('click', () => open(btn.getAttribute('data-drawer-open'))));
            closers.forEach(btn => btn.addEventListener('click', () => close(btn.closest('.orion-drawer'))));
            document.addEventListener('click', (e) => {
                const target = e.target;
                if (target.classList?.contains('orion-drawer')) close(target);
            });
        },

        // Buttons loading helper
        initializeLoadingButtons: function() {
            qsa('[data-loading]').forEach(btn => {
                btn.addEventListener('click', () => {
                    const dur = Number(btn.getAttribute('data-loading')) || 1200;
                    btn.classList.add('is-loading');
                    btn.disabled = true;
                    setTimeout(() => { btn.classList.remove('is-loading'); btn.disabled = false; }, dur);
                });
            });
        },

        // Keyboard shortcuts
        bindShortcuts: function() {
            document.addEventListener('keydown', (e) => {
                if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
                    e.preventDefault();
                    // Basic command palette
                    const existing = qs('#orion-cmd');
                    if (existing) { existing.remove(); return; }
                    const overlay = document.createElement('div');
                    overlay.id = 'orion-cmd';
                    overlay.innerHTML = `
                        <div class="orion-cmd-overlay"></div>
                        <div class="orion-cmd-panel orion-card">
                            <input class="orion-input" placeholder="Type a command... (e.g., toast success, open modal #myModal)" />
                            <div class="orion-cmd-hint">Try: <kbd>toast success</kbd>, <kbd>toast error</kbd>, <kbd>open #importModal</kbd></div>
                        </div>`;
                    document.body.appendChild(overlay);
                    const input = overlay.querySelector('input');
                    input.focus();
                    const close = () => overlay.remove();
                    overlay.querySelector('.orion-cmd-overlay').addEventListener('click', close);
                    input.addEventListener('keydown', (ev) => {
                        if (ev.key === 'Escape') close();
                        if (ev.key === 'Enter') {
                            const v = input.value.trim().toLowerCase();
                            if (v.startsWith('toast')) {
                                const type = v.split(' ')[1] || 'info';
                                this.showToast(`Sample ${type} toast`, type);
                            } else if (v.startsWith('open')) {
                                const sel = v.split(' ')[1];
                                const modal = qs(sel);
                                if (modal?.classList.contains('orion-modal')) modal.style.display = 'block';
                            }
                            close();
                        }
                    });
                    return;
                }
                if (e.key === 'Escape') {
                    qsa('.orion-modal').forEach(m => m.style.display = 'none');
                    qsa('.orion-dropdown-content').forEach(c => c.style.display = 'none');
                }
            });
        },
    };

    document.addEventListener('DOMContentLoaded', () => orion.init());
    window.orion = orion;
})();