// -- orion.js - Core Library --
// --------------------------------------
// Core Library Functionality
// --------------------------------------
(function() {
    'use strict';

    const orion = {
        init: function() {
            console.log('Orion UI Library initialized. B&W Theme is active.');
            this.addRippleEffect();
            this.initializeProgressBars();
            this.initializeModals();
            this.initializeToasts();
            this.initializeDropdowns();
            this.initializeAccordions();
            this.initializeTabs();
            this.initializeMatrixGrid();
            this.initializeCodeTerminal();
        },

        // A ripple effect on clicks
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

                    setTimeout(() => {
                        ripple.remove();
                    }, 600);
                });
            });
        },

        // Initialize progress bars
        initializeProgressBars: function() {
            const progressBars = document.querySelectorAll('.orion-progress-bar');
            progressBars.forEach(bar => {
                const value = bar.getAttribute('data-value');
                if (value) {
                    bar.style.width = `${value}%`;
                }
            });
        },

        // Handle modal functionality
        initializeModals: function() {
            const modalBtns = document.querySelectorAll('[data-modal-target]');
            const modals = document.querySelectorAll('.orion-modal');
            const closeBtns = document.querySelectorAll('.orion-modal-close');

            modalBtns.forEach(btn => {
                btn.addEventListener('click', () => {
                    const target = btn.getAttribute('data-modal-target');
                    const modal = document.querySelector(target);
                    if (modal) {
                        modal.style.display = 'block';
                    }
                });
            });

            closeBtns.forEach(btn => {
                btn.addEventListener('click', () => {
                    const modal = btn.closest('.orion-modal');
                    if (modal) {
                        modal.style.display = 'none';
                    }
                });
            });

            window.addEventListener('click', (e) => {
                modals.forEach(modal => {
                    if (e.target === modal) {
                        modal.style.display = 'none';
                    }
                });
            });
        },

        // Handle toast notifications
        initializeToasts: function() {
            const toastBtns = document.querySelectorAll('[data-toast-message]');
            let toastContainer = document.getElementById('orion-toast-container');
            if (!toastContainer) {
                toastContainer = document.createElement('div');
                toastContainer.id = 'orion-toast-container';
                document.body.appendChild(toastContainer);
            }

            toastBtns.forEach(btn => {
                btn.addEventListener('click', () => {
                    const message = btn.getAttribute('data-toast-message');
                    this.showToast(message);
                });
            });
        },

        showToast: function(message) {
            const toastContainer = document.getElementById('orion-toast-container');
            if (!toastContainer) return;

            const toast = document.createElement('div');
            toast.classList.add('orion-toast');
            toast.textContent = message;

            toastContainer.appendChild(toast);

            setTimeout(() => {
                toast.remove();
            }, 3000);
        },

        // Handle dropdown menus
        initializeDropdowns: function() {
            const dropdowns = document.querySelectorAll('.orion-dropdown');
            dropdowns.forEach(dropdown => {
                const btn = dropdown.querySelector('.orion-btn');
                const content = dropdown.querySelector('.orion-dropdown-content');

                btn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    content.style.display = content.style.display === 'block' ? 'none' : 'block';
                });

                document.addEventListener('click', (e) => {
                    if (!dropdown.contains(e.target)) {
                        content.style.display = 'none';
                    }
                });
            });
        },

        // Handle accordions
        initializeAccordions: function() {
            const headers = document.querySelectorAll('.orion-accordion-header');
            headers.forEach(header => {
                header.addEventListener('click', () => {
                    const content = header.nextElementSibling;
                    const isExpanded = content.style.maxHeight;

                    // Close all other accordions
                    document.querySelectorAll('.orion-accordion-content').forEach(c => {
                        c.style.maxHeight = null;
                    });

                    // Toggle current accordion
                    if (!isExpanded) {
                        content.style.maxHeight = content.scrollHeight + 'px';
                    }
                });
            });
        },

        // Handle tabs
        initializeTabs: function() {
            const tabContainers = document.querySelectorAll('.orion-tabs');
            tabContainers.forEach(container => {
                const headers = container.querySelectorAll('.orion-tab-header');
                headers.forEach(header => {
                    header.addEventListener('click', () => {
                        // Deactivate all headers and content
                        container.querySelectorAll('.orion-tab-header').forEach(h => h.classList.remove('orion-active-tab'));
                        container.querySelectorAll('.orion-tab-content').forEach(c => c.classList.remove('orion-active-content'));

                        // Activate the clicked header and its content
                        header.classList.add('orion-active-tab');
                        const targetId = header.getAttribute('data-tab');
                        const targetContent = document.getElementById(targetId);
                        if (targetContent) {
                            targetContent.classList.add('orion-active-content');
                        }
                    });
                });
            });
        },

        // Initialize Matrix Grid
        initializeMatrixGrid: function() {
            const grid = document.getElementById('orion-matrix-grid');
            if (!grid) return;
            const size = 500; // Total cells to fill the grid
            for (let i = 0; i < size; i++) {
                const cell = document.createElement('div');
                cell.classList.add('matrix-cell');
                cell.textContent = Math.random() < 0.5 ? '0' : '1';
                grid.appendChild(cell);
            }
            setInterval(() => {
                const cells = document.querySelectorAll('.matrix-cell');
                const randomCell = cells[Math.floor(Math.random() * cells.length)];
                randomCell.classList.add('active');
                setTimeout(() => {
                    randomCell.classList.remove('active');
                }, 2000);
            }, 50);
        },

        // Initialize Code Terminal
        initializeCodeTerminal: function() {
            const terminal = document.getElementById('orion-terminal-output');
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
            let typingTimeout;

            const typeCommand = () => {
                if (commandIndex < commands.length) {
                    const currentCommand = commands[commandIndex];
                    if (charIndex <= currentCommand.length) {
                        terminal.textContent = currentCommand.substring(0, charIndex) + '|';
                        charIndex++;
                        typingTimeout = setTimeout(typeCommand, 50);
                    } else {
                        terminal.textContent = currentCommand;
                        charIndex = 0;
                        commandIndex++;
                        setTimeout(typeCommand, 2000);
                    }
                } else {
                    commandIndex = 0;
                    typeCommand();
                }
            };
            typeCommand();
        }
    };

    // Run the initialization when the DOM is ready
    document.addEventListener('DOMContentLoaded', () => {
        orion.init();
    });

    window.orion = orion;
})();