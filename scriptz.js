document.addEventListener('DOMContentLoaded', function() {

    const bar = document.getElementById('bar');
    const close = document.getElementById('close');
    const nav = document.getElementById('navbar');

    console.log('🔍 Mobile navbar elements:', { bar: !!bar, close: !!close, nav: !!nav });

    if (bar && nav) {
        bar.addEventListener('click', function(e) {
            e.stopPropagation();
            nav.classList.add('active');
            console.log('✅ Navbar opened');
        });
    }

    if (close && nav) {
        close.addEventListener('click', function(e) {
            e.stopPropagation();
            nav.classList.remove('active');
            console.log('✅ Navbar closed (via X)');
        });
    }

    
    if (nav) {
        const navLinks = nav.querySelectorAll('li a');
        navLinks.forEach(function(link) {
            link.addEventListener('click', function() {
                const parent = this.closest('.dropdown');
                if (!parent) {
                    nav.classList.remove('active');
                    console.log('✅ Navbar closed (link clicked)');
                }
            });
        });
    }

    
    document.addEventListener('click', function(e) {
        const header = document.getElementById('header');
        if (nav && nav.classList.contains('active')) {
            const isClickInside = header && header.contains(e.target);
            if (!isClickInside) {
                nav.classList.remove('active');
                console.log('✅ Navbar closed (clicked outside)');
            }
        }
    });

});


//dropdown
(function() {
    'use strict';

    // Get all dropdown toggles
    const dropdownToggles = document.querySelectorAll('.dropdown > a');

    console.log('🔍 Dropdown toggles found:', dropdownToggles.length);

    // ── Close all dropdowns when clicking/tapping outside ──
    document.addEventListener('click', function(e) {
        const clickedInsideDropdown = e.target.closest('.dropdown');
        if (!clickedInsideDropdown) {
            document.querySelectorAll('.dropdown.open').forEach(function(dropdown) {
                dropdown.classList.remove('open');
                console.log('✅ Dropdown closed (clicked outside)');
            });
        }
    });

    // ── Toggle dropdown on click/tap ──
    dropdownToggles.forEach(function(toggle, index) {
        toggle.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();

            const parentDropdown = this.parentElement;
            console.log(`🔽 Dropdown ${index + 1} clicked:`, parentDropdown);

            // Close any other open dropdowns
            document.querySelectorAll('.dropdown.open').forEach(function(dropdown) {
                if (dropdown !== parentDropdown) {
                    dropdown.classList.remove('open');
                    console.log('✅ Other dropdown closed');
                }
            });

            
            
            parentDropdown.classList.toggle('open');
            console.log('✅ Dropdown .open class:', parentDropdown.classList.contains('open') ? 'ADDED' : 'REMOVED');
        });
    });

    
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            document.querySelectorAll('.dropdown.open').forEach(function(dropdown) {
                dropdown.classList.remove('open');
            });
            const nav = document.getElementById('navbar');
            if (nav) nav.classList.remove('active');
        }
    });

})();



document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('devModal');
    const openBtn = document.getElementById('openFormBtn');
    const closeBtn = document.querySelector('.modal-close');
    const form = document.getElementById('devForm');
    const submitBtn = document.getElementById('submitFormBtn');

    if (!modal || !openBtn || !closeBtn || !form || !submitBtn) {
        return;
    }

    function showNotification(message, color = '#10b981') {
        const oldNote = document.querySelector('.form-notification');
        if (oldNote) oldNote.remove();

        const note = document.createElement('div');
        note.className = 'form-notification';
        note.textContent = message;
        note.style.cssText = `
            background: ${color};
            color: #ffffff;
            padding: 14px 18px;
            border-radius: 10px;
            margin: 0 0 16px 0;
            font-weight: 600;
            font-size: 15px;
            text-align: center;
            animation: slideDown 0.3s ease;
            font-family: 'Montserrat', sans-serif;
        `;

        const modalContent = document.querySelector('.modal-content');
        const heading = modalContent.querySelector('h3');
        modalContent.insertBefore(note, heading.nextSibling);
    }

    function resetForm() {
        form.reset();
        submitBtn.disabled = false;
        submitBtn.textContent = 'Submit';
        const existingNote = document.querySelector('.form-notification');
        if (existingNote) existingNote.remove();
    }

    openBtn.addEventListener('click', function(e) {
        e.preventDefault();
        modal.classList.add('show');
    });

    closeBtn.addEventListener('click', function() {
        modal.classList.remove('show');
        resetForm();
    });

    window.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.classList.remove('show');
            resetForm();
        }
    });

    form.addEventListener('submit', function(e) {
        e.preventDefault();

        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending...';

        const name = document.getElementById('devName').value;
        const email = document.getElementById('devEmail').value;
        const message = document.getElementById('devMessage').value;

        const adminParams = {
            from_name: name,
            from_email: email,
            message: message,
            to_email: 'kevinelton34@gmail.com',
            time: new Date().toLocaleString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                timeZoneName: 'short'
            })
        };

        const autoReplyParams = {
            name: name,
            title: 'Website Development Consultation',
            to_email: email,
        };

        emailjs.send('service_nn38yk5selktion', 'template_6hen6as', adminParams)
            .then(function() {
                showNotification('✅ Message sent successfully! We\'ll get back to you shortly.');
                setTimeout(function() {
                    modal.classList.remove('show');
                    resetForm();
                }, 3000);

                emailjs.send('service_nn38yk5selktion', 'template_ntg6qug', autoReplyParams)
                    .then(function() {
                        console.log('✅ Auto-reply sent to:', email);
                    })
                    .catch(function(autoError) {
                        console.warn('⚠️ Auto-reply failed:', autoError);
                    });
            })
            .catch(function(error) {
                console.error('EmailJS error:', error);
                showNotification('❌ Failed to send. Please try again.', '#ef4444');
                submitBtn.disabled = false;
                submitBtn.textContent = 'Submit';
            });
    });
});

//count
document.addEventListener('DOMContentLoaded', function() {
    const counterElement = document.getElementById('visitorCount');
    if (!counterElement) return;

    const API_BASE = 'http://localhost:5000/api/visits';

    (async function updateVisitorCount() {
        try {
            const sessionKey = 'visitor_counted';
            if (!sessionStorage.getItem(sessionKey)) {
                await fetch(API_BASE, { method: 'POST' });
                sessionStorage.setItem(sessionKey, 'true');
            }

            const response = await fetch(API_BASE);
            const data = await response.json();

            if (data.success) {
                counterElement.textContent = data.count;
            } else {
                throw new Error('API returned error');
            }
        } catch (error) {
            console.warn('⚠️ Visitor counter error:', error);
            counterElement.textContent = '❤️';
        }
    })();
});
