// script.js

document.addEventListener('DOMContentLoaded', () => {
    console.log('Dashboard loaded successfully.');

    // --- Notifications Logic ---
    const notificationBtn = document.querySelector('.notification-btn');
    const notificationOverlay = document.querySelector('.notification-overlay');

    if (notificationBtn && notificationOverlay) {
        notificationBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            notificationOverlay.classList.toggle('hidden');
        });

        // Close on click outside
        document.addEventListener('click', (e) => {
            if (!notificationOverlay.contains(e.target) && !notificationBtn.contains(e.target)) {
                notificationOverlay.classList.add('hidden');
            }
        });
    }



    // --- Quick Action Buttons ---
    const actionCards = document.querySelectorAll('.action-card');
    actionCards.forEach(card => {
        card.addEventListener('click', function () {
            // Visual feedback
            const originalTransform = this.style.transform;
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = originalTransform;
                const actionName = this.querySelector('span:last-child').innerText;
                console.log('Quick action triggered:', actionName);
            }, 100);
        });
    });

    // Simple interaction for the account button
    const accountBtn = document.querySelector('.account-btn');

    if (accountBtn) {
        accountBtn.addEventListener('click', () => {
            console.log('Account settings clicked');
            // Here you could toggle a dropdown menu
            alert('Account settings clicked - functionality coming soon!');
        });
    }

    // Add staggered animation for widget cards on load
    const cards = document.querySelectorAll('.widget-card');
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s cubic-bezier(0.2, 0.8, 0.2, 1)';

        setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, 100 + (index * 100));
    });
    // --- Settings Page Logic ---
    const passwordForm = document.getElementById('password-form');
    if (passwordForm) {
        passwordForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const newPass = document.getElementById('new-password').value;
            const confirmPass = document.getElementById('confirm-password').value;

            if (newPass !== confirmPass) {
                alert('Passwords do not match!');
                return;
            }
            if (newPass.length < 6) {
                alert('Password must be at least 6 characters.');
                return;
            }

            // Simulator API call
            const btn = passwordForm.querySelector('button[type="submit"]');
            const originalText = btn.innerText;
            btn.innerText = 'Updating...';
            setTimeout(() => {
                btn.innerText = originalText;
                alert('Password updated successfully!');
                passwordForm.reset();
            }, 1000);
        });
    }

    const deleteAccountBtn = document.getElementById('delete-account-btn');
    if (deleteAccountBtn) {
        deleteAccountBtn.addEventListener('click', () => {
            if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
                // Simulate deletion
                alert('Account deleted. Redirecting to login...');
                document.body.innerHTML = '<div style="display:flex;justify-content:center;align-items:center;height:100vh;background:#f5f5f7;"><h1>Account Deleted</h1></div>';
            }
        });
    }
});
