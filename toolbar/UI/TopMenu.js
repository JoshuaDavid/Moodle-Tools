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
        'z-index': 9999 //May the force be with this code!
    });
    $shim.css({
        'height': '2em',
    });
	
	/
	//does nothing..
    if(tm.components.length) 
	{
		$(tm.el).show();
		//console.log("I'm showing the toolbar now");
	}
    else 
	{
		$(tm.el).hide();
		//console.log("I'm hiding the toolbar now");
	}

    $('body').prepend($topbar);
    $('body').prepend($shim);

    return tm;
}

/*
TopMenu.prototype.add = function(cpt) {
    var tm = this;
    tm.components.push(cpt);
    
	if(cpt.el)
		$(tm.el).append(cpt.el);
    else
		$(tm.el).append(cpt);

    cpt.parent = tm;
	
    if
		(tm.components.length) $(tm.el).show();
    else 
		$(tm.el).hide();

    return tm;
}*/

TM = new TopMenu();
