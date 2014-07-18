// Submit without page change. This lets you create many copies of the same item without
// having to click "create an activity" from the Moodle Course home page. This is particularly
// useful if one or two things change from one to the other, but most stuff stays the same. Combined
// with the Show_Hidden_Fields script, allows you to create all the labels or all the Collaborate sessions
// for a given course very quickly.

javascript:void (function() {$.post($('form').attr('action'), $('form').serialize())}());
