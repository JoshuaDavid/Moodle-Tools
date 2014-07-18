// Require: ./jquery.min.js

FunctionButton = function(title, fn) {
    var fb = this;
    fb.title = title;
    var $button = $('<button/>');
    $button.html(title);
    $button.click(fn);
    fb.el = $button[0];
    return fb;
}
