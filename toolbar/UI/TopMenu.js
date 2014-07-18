// Require: ./jquery.min.js

TopMenu = function() {
    var tm = this;
    tm.components = [];
    var $topbar = $('<div/>');
    tm.el = $topbar[0];
    $topbar.hide();
    $('body').prepend($topbar);
    $topbar.css({
        'background': '#ededee', // from moodle theme
        'height': '2em',
        'border-bottom': '1px solid black'
    });
    if(tm.components.length) $(tm.el).show(500);
    else $(tm.el).hide(500);
    return tm;
}

TopMenu.prototype.add = function(cpt) {
    var tm = this;
    tm.components.push(cpt);
    $(tm.el).append(cpt.el);
    cpt.parent = tm;
    if(tm.components.length) $(tm.el).show(500);
    else $(tm.el).hide(500);
    return tm;
}

TM = new TopMenu();
