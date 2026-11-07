/*
  Forma — Contact page
  Checks the booking form with our own rules and messages.
*/

const bookingForm = document.getElementById('booking-form');

const MAX_MESSAGE_LENGTH = 500;
const MAX_DAYS_AHEAD = 60;

/* ===== Small checks that return true or false ===== */
function isValidEmail(value) {
  // something@something.domain, no spaces
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value);
}

function countDigits(value) {
  return value.replace(/\D/g, '').length;
}

// Today at 00:00, so a visit "today" still counts as a valid date
function getToday() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
}

/* ===== One function per field =====
   Each returns an error message, or an empty string when the value is fine. */
function validateName(value) {
  const name = value.trim();
  if (name === '') {
    return 'Please enter your full name.';
  }
  if (!/^[\p{L}\s'-]+$/u.test(name)) {
    return 'Use letters only — no numbers or symbols.';
  }
  if (name.split(/\s+/).length < 2) {
    return 'Please enter both your first and last name.';
  }
  return '';
}

function validateEmail(value) {
  const email = value.trim();
  if (email === '') {
    return 'Please enter your email so we can confirm the visit.';
  }
  if (!isValidEmail(email)) {
    return 'This email looks incomplete, e.g. name@example.com.';
  }
  return '';
}

function validatePhone(value) {
  const phone = value.trim();
  if (phone === '') {
    return ''; // the phone is optional
  }
  if (!/^\+?[\d\s()-]+$/.test(phone)) {
    return 'Use digits, spaces, brackets or dashes only.';
  }
  if (countDigits(phone) !== 11) {
    return 'A Kazakhstan number has 11 digits, e.g. +7 700 000 00 00.';
  }
  return '';
}

function validateDate(value) {
  if (value === '') {
    return 'Please choose a date for your visit.';
  }

  const chosen = new Date(value + 'T00:00:00');
  const today = getToday();
  const lastDay = getToday();
  lastDay.setDate(lastDay.getDate() + MAX_DAYS_AHEAD);

  if (chosen < today) {
    return 'This date has already passed.';
  }
  if (chosen > lastDay) {
    return 'We take bookings up to ' + MAX_DAYS_AHEAD + ' days ahead.';
  }
  return '';
}

function validateGuests(value) {
  if (value === '') {
    return 'Please tell us how many people are coming.';
  }
  const guests = Number(value);
  if (!Number.isInteger(guests) || guests < 1 || guests > 6) {
    return 'Our showroom tours are for 1 to 6 guests.';
  }
  return '';
}

function validateTopic(value) {
  return value === '' ? 'Please choose what you would like to see.' : '';
}

function validateMessage(value) {
  const message = value.trim();
  if (message.length > MAX_MESSAGE_LENGTH) {
    return 'Please keep the message under ' + MAX_MESSAGE_LENGTH + ' characters.';
  }
  // A custom order needs a few details so the designer can prepare
  const topic = bookingForm.elements.topic.value;
  if (topic === 'custom' && message.length < 20) {
    return 'For a custom order, describe the piece in at least 20 characters.';
  }
  return '';
}

function validateConsent(checked) {
  return checked ? '' : 'Please agree so we can contact you about the visit.';
}

// Field name → its check. The keys match the name="" attributes in the HTML.
const validators = {
  name: validateName,
  email: validateEmail,
  phone: validatePhone,
  date: validateDate,
  guests: validateGuests,
  topic: validateTopic,
  message: validateMessage,
  consent: validateConsent
};

/* ===== Showing the result next to the field ===== */

// Checkboxes give true/false, every other field gives its text value
function getFieldValue(field) {
  return field.type === 'checkbox' ? field.checked : field.value;
}

// Writes the message under the field and colors its border.
// Optional empty fields stay neutral instead of turning green.
function showFieldResult(field, message) {
  const errorBox = document.getElementById(field.id + '-error');
  errorBox.textContent = message;

  const isEmptyOptional = !field.required && field.value.trim() === '';
  field.classList.toggle('is-invalid', message !== '');
  field.classList.toggle('is-valid', message === '' && !isEmptyOptional && field.type !== 'checkbox');
  field.setAttribute('aria-invalid', String(message !== ''));
}

// Checks one field; returns true when it is valid
function validateField(field) {
  const check = validators[field.name];
  if (!check) {
    return true;
  }
  const message = check(getFieldValue(field));
  showFieldResult(field, message);
  return message === '';
}

document.addEventListener('DOMContentLoaded', function () {
  // The date picker starts at today, so past days are greyed out
  const dateInput = bookingForm.elements.date;
  const today = getToday();
  const offset = today.getTimezoneOffset() * 60000;
  dateInput.min = new Date(today - offset).toISOString().slice(0, 10);

  const fields = bookingForm.querySelectorAll('input, select, textarea');

  fields.forEach(function (field) {
    // Leaving a field checks it ("blur" — after the visitor is done typing)
    field.addEventListener('blur', function () {
      if (field.value !== '' || field.classList.contains('is-invalid')) {
        validateField(field);
      }
    });

    // While typing, an error disappears as soon as the value becomes valid
    field.addEventListener('input', function () {
      if (field.classList.contains('is-invalid') || field.classList.contains('is-valid')) {
        validateField(field);
      }
    });
  });

  // The topic changes the message rule (custom orders need details)
  bookingForm.elements.topic.addEventListener('change', function (event) {
    validateField(event.target);
    const message = bookingForm.elements.message;
    if (message.classList.contains('is-invalid') || message.value !== '') {
      validateField(message);
    }
  });

  // A checkbox has no typing, so it is checked on every change
  bookingForm.elements.consent.addEventListener('change', function (event) {
    validateField(event.target);
  });
});
