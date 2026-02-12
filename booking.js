// ===== SHAMMA SALON BOOKING SYSTEM =====
console.log('🔧 Loading booking system...');

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    console.log('✅ DOM loaded, setting up booking...');
    setupBookingForm();
});

// Setup booking form
function setupBookingForm() {
    const bookingForm = document.getElementById('bookingForm');
    if (!bookingForm) {
        console.log('⚠️ Booking form not found');
        return;
    }
    
    console.log('📝 Setting up booking form...');
    
    // Form submission
    bookingForm.addEventListener('submit', function(event) {
        event.preventDefault();
        console.log('📤 Form submitted');
        
        // Collect form data
        const bookingData = {
            service: document.getElementById('bookingService').value,
            name: document.getElementById('bookingName').value.trim(),
            phone: document.getElementById('bookingPhone').value.trim(),
            date: document.getElementById('bookingDate').value,
            time: document.getElementById('bookingTime').value,
            notes: document.getElementById('bookingNotes').value.trim(),
            timestamp: new Date().toISOString(),
            id: Date.now(),
            status: 'pending'
        };
        
        console.log('📋 Booking data:', bookingData);
        
        // Validate form
        if (validateBooking(bookingData)) {
            processBooking(bookingData);
        }
    });
    
    // Phone number formatting
    const phoneInput = document.getElementById('bookingPhone');
    if (phoneInput) {
        phoneInput.addEventListener('input', function() {
            let value = this.value.replace(/\D/g, '');
            if (value.length > 0) {
                value = '+968 ' + value.substring(0, 4) + ' ' + value.substring(4, 8);
            }
            this.value = value;
        });
    }
    
    console.log('✅ Booking form setup complete');
}

// Validate booking data
function validateBooking(data) {
    console.log('🔍 Validating booking...');
    
    if (!data.name || data.name.length < 2) {
        showAlert('Please enter your full name (minimum 2 characters)', 'error');
        document.getElementById('bookingName').focus();
        return false;
    }
    
    if (!data.phone || data.phone.replace(/\D/g, '').length < 8) {
        showAlert('Please enter a valid Omani phone number', 'error');
        document.getElementById('bookingPhone').focus();
        return false;
    }
    
    if (!data.date) {
        showAlert('Please select a date', 'error');
        document.getElementById('bookingDate').focus();
        return false;
    }
    
    if (!data.time) {
        showAlert('Please select a time', 'error');
        document.getElementById('bookingTime').focus();
        return false;
    }
    
    // Check if date is in the future
    const selectedDate = new Date(data.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (selectedDate <= today) {
        showAlert('Please select a future date', 'error');
        document.getElementById('bookingDate').focus();
        return false;
    }
    
    console.log('✅ Booking validation passed');
    return true;
}

// Process booking
function processBooking(data) {
    console.log('🚀 Processing booking...');
    
    const submitBtn = bookingForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    
    // Show loading state
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
    submitBtn.disabled = true;
    
    // Save to localStorage for admin
    saveBookingToStorage(data);
    
    // Simulate API call
    setTimeout(() => {
        // Show success message
        const successMessage = `✅ BOOKING CONFIRMED!\n\nThank you ${data.name}!\n\n📋 Service: ${data.service}\n📅 Date: ${data.date}\n⏰ Time: ${data.time}\n📞 Phone: ${data.phone}\n\nWe will contact you soon to confirm your appointment.`;
        
        alert(successMessage);
        console.log('🎉 Booking completed:', data);
        
        // Close modal
        closeBookingModal();
        
        // Reset form
        document.getElementById('bookingForm').reset();
        
        // Reset button
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }, 1500);
}

// Save booking to localStorage
function saveBookingToStorage(data) {
    try {
        console.log('💾 Saving booking to storage...');
        
        // Get existing bookings
        let bookings = JSON.parse(localStorage.getItem('shammaBookings'));
        if (!bookings) {
            bookings = [];
            console.log('📁 Created new bookings array');
        }
        
        // Add new booking
        bookings.push(data);
        
        // Save back to localStorage
        localStorage.setItem('shammaBookings', JSON.stringify(bookings));
        
        console.log('✅ Booking saved. Total:', bookings.length);
        
        // Also update feedback system if it exists
        updateFeedbackSystem(data);
        
        return true;
    } catch (error) {
        console.error('❌ Error saving booking:', error);
        showAlert('Error saving booking. Please try again.', 'error');
        return false;
    }
}

// Update feedback system with booking data
function updateFeedbackSystem(bookingData) {
    try {
        // Get existing feedback data
        let feedbackData = JSON.parse(localStorage.getItem('shammaFeedback')) || [];
        
        // Create automatic feedback entry for booking
        const feedbackEntry = {
            id: Date.now(),
            name: bookingData.name,
            type: 'booking',
            rating: 5, // Default rating for bookings
            text: `Booked ${bookingData.service} for ${bookingData.date}`,
            date: new Date().toISOString().split('T')[0],
            status: 'good',
            source: 'booking-system'
        };
        
        feedbackData.push(feedbackEntry);
        localStorage.setItem('shammaFeedback', JSON.stringify(feedbackData));
        
        console.log('📝 Added booking to feedback system');
    } catch (error) {
        console.error('Error updating feedback system:', error);
    }
}

// Show alert message
function showAlert(message, type = 'info') {
    // Remove existing alerts
    const existingAlerts = document.querySelectorAll('.alert-message');
    existingAlerts.forEach(alert => alert.remove());
    
    // Create alert element
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert-message alert-${type}`;
    alertDiv.innerHTML = `
        <span>${message}</span>
        <button class="close-alert">&times;</button>
    `;
    
    // Add styles
    const style = document.createElement('style');
    style.textContent = `
        .alert-message {
            position: fixed;
            top: 100px;
            right: 20px;
            padding: 15px 20px;
            border-radius: 8px;
            color: white;
            font-weight: 500;
            display: flex;
            align-items: center;
            justify-content: space-between;
            min-width: 300px;
            max-width: 400px;
            z-index: 9999;
            animation: slideIn 0.3s ease;
            box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        }
        
        .alert-error {
            background: #e74c3c;
            border-left: 5px solid #c0392b;
        }
        
        .alert-success {
            background: #27ae60;
            border-left: 5px solid #219653;
        }
        
        .alert-info {
            background: #3498db;
            border-left: 5px solid #2980b9;
        }
        
        .close-alert {
            background: none;
            border: none;
            color: white;
            font-size: 1.5rem;
            cursor: pointer;
            margin-left: 15px;
            line-height: 1;
        }
        
        @keyframes slideIn {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
    `;
    document.head.appendChild(style);
    
    // Add to body
    document.body.appendChild(alertDiv);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (alertDiv.parentNode) {
            alertDiv.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => alertDiv.remove(), 300);
        }
    }, 5000);
    
    // Close button functionality
    alertDiv.querySelector('.close-alert').addEventListener('click', function() {
        alertDiv.remove();
    });
}

// Close booking modal
function closeBookingModal() {
    const modal = document.getElementById('bookingModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// Global error handler
window.addEventListener('error', function(event) {
    console.error('⚠️ JavaScript Error:', event.message);
    console.error('File:', event.filename);
    console.error('Line:', event.lineno);
    
    // Show user-friendly error message
    showAlert('An error occurred. Please refresh the page and try again.', 'error');
});

// Check for existing bookings on page load
function checkExistingBookings() {
    const bookings = JSON.parse(localStorage.getItem('shammaBookings')) || [];
    console.log(`📊 Found ${bookings.length} existing bookings`);
    
    if (bookings.length > 0) {
        // Update any admin panels on the page
        updateAdminPanels(bookings);
    }
}

// Update admin panels with booking data
function updateAdminPanels(bookings) {
    // Check if admin panel exists on this page
    const adminStats = document.getElementById('adminStats');
    if (adminStats) {
        const pendingCount = bookings.filter(b => b.status === 'pending').length;
        const confirmedCount = bookings.filter(b => b.status === 'confirmed').length;
        
        adminStats.innerHTML = `
            <div class="stat">Total: ${bookings.length}</div>
            <div class="stat">Pending: ${pendingCount}</div>
            <div class="stat">Confirmed: ${confirmedCount}</div>
        `;
    }
}

// Initialize booking checks
checkExistingBookings();

console.log('🚀 Booking system ready');
