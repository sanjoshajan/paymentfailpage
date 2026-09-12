/**
 * Mind Energies - Payment Failure Page Interactivity
 * "Understand Your Mind. Transform Your Energy. Transform Your Life."
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. URL Query Parameter Parser
    const urlParams = new URLSearchParams(window.location.search);
    
    // Dynamic Parameter Defaults
    const config = {
        orderId: urlParams.get('order_id') || urlParams.get('tx_id') || urlParams.get('reference') || 'ME-89421-TX',
        programName: urlParams.get('program') || urlParams.get('item') || 'BAT45™ Breath Automation Technique',
        amount: urlParams.get('amount') || '4,999.00',
        currency: urlParams.get('currency') || '₹',
        retryUrl: urlParams.get('retry_url') || urlParams.get('redirect_url') || '',
        supportEmail: urlParams.get('email') || 'support@mindenergies.com',
        supportPhone: urlParams.get('phone') || '+917889631295',
        timestamp: urlParams.get('time') || null,
        appointmentUrl: urlParams.get('appointment_url') || urlParams.get('appointment') || 'https://mindenergies.in/',
        paymentUrl: urlParams.get('payment_url') || urlParams.get('pay_url') || urlParams.get('pay_link') || urlParams.get('retry_url') || '#'
    };

    // 2. DOM Elements
    const payNowBtn = document.getElementById('payNowBtn');
    const bookAppointmentBtn = document.getElementById('bookAppointmentBtn');
    const bookServicesBtn = document.getElementById('bookServicesBtn');
    const displayOrderId = document.getElementById('displayOrderId');
    const displayProgramName = document.getElementById('displayProgramName');
    const displayAmount = document.getElementById('displayAmount');
    const displayTimestamp = document.getElementById('displayTimestamp');
    const copyRefBtn = document.getElementById('copyRefBtn');
    const tryPaymentAgainBtn = document.getElementById('tryPaymentAgainBtn');
    const changeMethodBtn = document.getElementById('changeMethodBtn');
    const toastNotification = document.getElementById('toastNotification');
    const toastMessage = document.getElementById('toastMessage');
    const themeToggleBtn = document.getElementById('themeToggleBtn');
    const retryModal = document.getElementById('retryModal');
    const closeModalBtn = document.getElementById('closeModalBtn');
    const modalProceedBtn = document.getElementById('modalProceedBtn');
    const methodOptionBtns = document.querySelectorAll('.method-option-btn');
    const whatsappSupportBtn = document.getElementById('whatsappSupportBtn');
    const emailSupportBtn = document.getElementById('emailSupportBtn');
    const returnHomeLink = document.getElementById('returnHomeLink');

    // 3. Populate Dynamic Content
    if (displayOrderId) displayOrderId.textContent = config.orderId;
    if (displayProgramName) displayProgramName.textContent = config.programName;
    if (displayAmount) {
        // Format amount if clean number passed
        const formattedAmount = isNaN(config.amount) ? config.amount : Number(config.amount).toLocaleString('en-IN');
        displayAmount.textContent = `${config.currency}${formattedAmount}`;
    }
    
    if (displayTimestamp) {
        if (config.timestamp) {
            displayTimestamp.textContent = config.timestamp;
        } else {
            const now = new Date();
            const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            displayTimestamp.textContent = `Today at ${timeString}`;
        }
    }

    if (payNowBtn && config.paymentUrl && config.paymentUrl !== '#') {
        payNowBtn.href = config.paymentUrl;
    }

    if (bookAppointmentBtn && config.appointmentUrl && config.appointmentUrl !== '#') {
        bookAppointmentBtn.href = config.appointmentUrl;
    }

    // Dynamic Support Links
    if (whatsappSupportBtn) {
        const waMsg = encodeURIComponent(`Hi Mind Energies Support, my payment could not be completed for Order ${config.orderId} (${config.currency}${config.amount}). Please assist.`);
        whatsappSupportBtn.href = `https://wa.me/${config.supportPhone.replace(/[^0-9]/g, '')}?text=${waMsg}`;
    }

    if (emailSupportBtn) {
        const subject = encodeURIComponent(`Payment Issue: Order ${config.orderId}`);
        const body = encodeURIComponent(
            `Hi Mind Energies Support Team,\n\n` +
            `My payment could not be completed.\n\n` +
            `Transaction Reference: ${config.orderId}\n` +
            `Program: ${config.programName}\n` +
            `Amount: ${config.currency}${config.amount}\n` +
            `Date/Time: ${displayTimestamp ? displayTimestamp.textContent : 'Recent'}\n\n` +
            `Please help me complete my enrollment.\n`
        );
        emailSupportBtn.href = `mailto:${config.supportEmail}?subject=${subject}&body=${body}`;
    }

    // 4. Toast Notification Utility
    let toastTimeout;
    function showToast(message) {
        if (toastMessage) toastMessage.textContent = message;
        if (toastNotification) {
            toastNotification.classList.add('is-visible');
            clearTimeout(toastTimeout);
            toastTimeout = setTimeout(() => {
                toastNotification.classList.remove('is-visible');
            }, 3000);
        }
    }

    // 5. Copy Reference ID
    if (copyRefBtn) {
        copyRefBtn.addEventListener('click', async () => {
            try {
                await navigator.clipboard.writeText(config.orderId);
                showToast('Order Reference copied to clipboard!');
            } catch (err) {
                // Fallback copy
                const tempInput = document.createElement('input');
                tempInput.value = config.orderId;
                document.body.appendChild(tempInput);
                tempInput.select();
                document.execCommand('copy');
                document.body.removeChild(tempInput);
                showToast('Order Reference copied!');
            }
        });
    }

    // 6. "Try Payment Again" Button Action
    if (tryPaymentAgainBtn) {
        tryPaymentAgainBtn.addEventListener('click', () => {
            // Set button to loading state
            tryPaymentAgainBtn.classList.add('is-loading');
            tryPaymentAgainBtn.disabled = true;

            setTimeout(() => {
                tryPaymentAgainBtn.classList.remove('is-loading');
                tryPaymentAgainBtn.disabled = false;

                if (config.retryUrl && config.retryUrl !== '#') {
                    // Redirect to payment gateway or checkout URL
                    window.location.href = config.retryUrl;
                } else {
                    // Open payment method selector modal
                    openModal();
                }
            }, 750);
        });
    }

    // 7. Modal Controls
    function openModal() {
        if (retryModal) {
            retryModal.classList.add('is-open');
            retryModal.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden';
        }
    }

    function closeModal() {
        if (retryModal) {
            retryModal.classList.remove('is-open');
            retryModal.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
        }
    }

    if (changeMethodBtn) {
        changeMethodBtn.addEventListener('click', openModal);
    }

    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', closeModal);
    }

    if (retryModal) {
        retryModal.addEventListener('click', (e) => {
            if (e.target === retryModal) {
                closeModal();
            }
        });
    }

    // Modal method option selection
    methodOptionBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            methodOptionBtns.forEach(b => b.classList.remove('selected'));
            btn.classList.add('selected');
        });
    });

    if (modalProceedBtn) {
        modalProceedBtn.addEventListener('click', () => {
            const selectedBtn = document.querySelector('.method-option-btn.selected');
            const selectedMethod = selectedBtn ? selectedBtn.getAttribute('data-method') : 'upi';
            
            modalProceedBtn.textContent = 'Connecting to Gateway...';
            modalProceedBtn.disabled = true;

            setTimeout(() => {
                modalProceedBtn.textContent = 'Proceed to Secure Gateway';
                modalProceedBtn.disabled = false;
                closeModal();
                showToast(`Initiating checkout with ${selectedMethod.toUpperCase()}...`);
                
                // If custom retryUrl is provided, redirect
                if (config.retryUrl) {
                    window.location.href = config.retryUrl;
                }
            }, 1200);
        });
    }

    // 8. Theme Toggle (Dark / Light)
    const savedTheme = localStorage.getItem('me_theme') || 'theme-dark';
    document.body.className = savedTheme;

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            if (document.body.classList.contains('theme-dark')) {
                document.body.classList.replace('theme-dark', 'theme-light');
                localStorage.setItem('me_theme', 'theme-light');
                showToast('Switched to Light mode');
            } else {
                document.body.classList.replace('theme-light', 'theme-dark');
                localStorage.setItem('me_theme', 'theme-dark');
                showToast('Switched to Dark mode');
            }
        });
    }

    // 9. Keyboard Accessibility (Escape to close modal)
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && retryModal && retryModal.classList.contains('is-open')) {
            closeModal();
        }
    });
});
