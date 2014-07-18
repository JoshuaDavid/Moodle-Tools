// Require: ./jquery.min.js

// Takes two function buttons and toggles between them
// The first one is shown by default
ToggleButton = function(fb1, fb2) {
    var tb = this;
    var $holder = $('<div/>');
    $holder.css({
        'display': 'inline-block',
        'padding': '0'
    });
    tb.el = $holder[0];
    $holder.append(fb1.el);
    $holder.append(fb2.el);
    $(fb2.el).hide();
    $(fb1.el).click(function() {
        $(fb1.el).hide();
        $(fb2.el).show();
    });
    $(fb2.el).click(function() {
        $(fb1.el).show();
        $(fb2.el).hide();
    });
    return tb;
}
