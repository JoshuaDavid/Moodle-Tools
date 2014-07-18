// Require: ./jquery.min.js

ContextMenu = function(x, y, options) {
    var cm = this;
    var $ctxmenu = $('<div/>');
    $ctxmenu.css({
        "position": "absolute",
        "left": x,
        "top": y,
        "background": "white",
        "border": "1px solid black",
    });
    for(var i = 0, option; option = options[i]; i++) {
        $opt = $('<div/>');
        $opt.css({
            "background": "white",
            "border-bottom": "1px solid gray",
        });
        $opt.html(option.title);
        $opt.click(option.fn);
        $opt.click($ctxmenu.remove());
        $ctxmenu.append($opt);
    }
    setTimeout(function() {
        $ctxmenu.remove();
    }, 5000);
    $('body').append($ctxmenu);
    return cm;
}
