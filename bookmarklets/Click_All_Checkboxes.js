// Click all checkboxes. If they are unchecked, it checks them, and if they are
// checked, it unchecks them. Useful for Moodle pages with no "check all" button.
javascript:[].slice.call(document.querySelectorAll('input[type="checkbox"]')).forEach(function(checkbox) {checkbox.click()}); void 0;
