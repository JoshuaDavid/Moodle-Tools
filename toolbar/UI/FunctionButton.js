// Require: jquery.min.js

FunctionButton = function(title, action, visFn, opts) {
    var fb = this;
    if(visFn === undefined) {
        visFn = function() { return true; };
    }
    if(opts === undefined) {
        opts = {};
    }
    fb.visFn = visFn;
    fb.visible = true;
    fb.title = title;
    var $button = $('<button/>');
    $button.html(title);
    $button.click(action);
    if(opts && opts.disableOnClick) {
        $button.click(function() {
            $button.attr("disabled", true);
            $button.css('visibility', 'hidden');
        });
    }
    fb.el = $button[0];
    fb.refresh();
    return fb;
}

FunctionButton.prototype.refresh = function() {
    var fb = this;
    if(visFn) {
        $(fb.el).show();
        fb.visible = true;
    } else {
        $(fb.el).hide();
        fb.visible = true;
    }
    return fb;
}
