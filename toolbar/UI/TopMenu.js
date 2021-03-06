// Require: jquery.min.js

TopMenu = function() {
    var tm = this;
    tm.components = [];
    var $topbar = $('<div/>');
    var $shim = $('<div/>');
    tm.el = $topbar[0];
    $topbar.hide();
    $topbar.css({
        'background': '#ededee', // from moodle theme
        'height': '2em',
        'border-bottom': '1px solid black',
        'border-right': '1px solid black',
        'position': 'absolute',
        'top': '0px',
        'z-index': 9999
    });
    $shim.css({
        'height': '2em',
    });
    if(tm.components.length) $(tm.el).show();
    else $(tm.el).hide();
    $('body').prepend($topbar);
    $('body').prepend($shim);
    return tm;
}

TopMenu.prototype.add = function(cpt) {
    var tm = this;
    tm.components.push(cpt);
    if(cpt.el) {
        $(tm.el).append(cpt.el);
    } else {
        $(tm.el).append(cpt);
    }
    cpt.parent = tm;
    if(tm.components.length) $(tm.el).show();
    else $(tm.el).hide();
    return tm;
}

TM = new TopMenu();
