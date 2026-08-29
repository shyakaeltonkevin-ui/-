// ============================================================
// NAVBAR – open / close mobile menu
// ============================================================

const bar = document.getElementById('bar');
const close = document.getElementById('close');
const nav = document.getElementById('navbar');

if (bar) {
    bar.addEventListener('click', () => {
        nav.classList.add('active');
    });
}

if (close) {
    close.addEventListener('click', () => {
        nav.classList.remove('active');
    });
}


// ============================================================
// DROPDOWN – works for both HOVER (mouse) and CLICK (touch)
// ============================================================

(function() {
    'use strict';

    // Get all dropdown toggles (the <a> inside .dropdown)
    const dropdownToggles = document.querySelectorAll('.dropdown > a');

    // Close any open dropdown when clicking outside
    document.addEventListener('click', function(e) {
        const clickedInsideDropdown = e.target.closest('.dropdown');
        if (!clickedInsideDropdown) {
            document.querySelectorAll('.dropdown.open').forEach(function(dropdown) {
                dropdown.classList.remove('open');
            });
        }
    });

    dropdownToggles.forEach(function(toggle) {
        toggle.addEventListener('click', function(e) {
            // Prevent the default anchor behavior (if href="#")
            e.preventDefault();

            const parentDropdown = this.parentElement; // the <li> with class .dropdown

            // Close any other open dropdowns
            document.querySelectorAll('.dropdown.open').forEach(function(dropdown) {
                if (dropdown !== parentDropdown) {
                    dropdown.classList.remove('open');
                }
            });

            // Toggle the 'open' class on this dropdown
            parentDropdown.classList.toggle('open');
        });
    });

    // Close dropdowns when pressing Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            document.querySelectorAll('.dropdown.open').forEach(function(dropdown) {
                dropdown.classList.remove('open');
            });
        }
    });

})();


// ============================================================
// DEVELOPMENT PAGE – MODAL WITH NOTIFICATION & AUTO-REPLY
// ============================================================

const modal = document.getElementById('devModal');
const openBtn = document.getElementById('openFormBtn');
const closeBtn = document.querySelector('.modal-close');
const form = document.getElementById('devForm');
const submitBtn = document.getElementById('submitFormBtn');

// ── Helper: show notification inside modal ──
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

// ── Helper: reset form ──
function resetForm() {
    form.reset();
    submitBtn.disabled = false;
    submitBtn.textContent = 'Submit';
    const existingNote = document.querySelector('.form-notification');
    if (existingNote) existingNote.remove();
}

// ── Only run if modal elements exist ──
if (modal && openBtn && closeBtn && form && submitBtn) {

    // Open modal
    openBtn.addEventListener('click', (e) => {
        e.preventDefault();
        modal.classList.add('show');
    });

    // Close modal (X button)
    closeBtn.addEventListener('click', () => {
        modal.classList.remove('show');
        resetForm();
    });

    // Close modal (click outside)
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('show');
            resetForm();
        }
    });

    // ── ✅ EmailJS submission: Success depends ONLY on admin email ──
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending...';

        const name = document.getElementById('devName').value;
        const email = document.getElementById('devEmail').value;
        const message = document.getElementById('devMessage').value;

        // ── Admin notification (to you) ──
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

        // ── Auto-reply (to the user) ──
        const autoReplyParams = {
            name: name,
            title: 'Website Development Consultation',
            to_email: email,
        };

        // ── Step 1: Send admin email ──
        emailjs.send('service_nn38yk5selktion', 'template_6hen6as', adminParams)
            .then(() => {
                // ✅ Admin sent successfully → Show success notification immediately
                showNotification('✅ Message sent successfully! We\'ll get back to you shortly.');
                
                // Auto-close after 3 seconds
                setTimeout(() => {
                    modal.classList.remove('show');
                    resetForm();
                }, 3000);

                // ── Step 2: Try to send auto-reply (in the background) ──
                emailjs.send('service_nn38yk5selktion', 'template_ntg6qug', autoReplyParams)
                    .then(() => {
                        console.log('✅ Auto-reply sent successfully to:', email);
                    })
                    .catch((autoError) => {
                        console.warn('⚠️ Auto-reply failed but admin was sent:', autoError);
                    });
            })
            .catch((error) => {
                console.error('EmailJS error:', error);
                showNotification('❌ Failed to send. Please try again.', '#ef4444');
                submitBtn.disabled = false;
                submitBtn.textContent = 'Submit';
            });
    });

} // end if elements exist