// Require: jquery.min.js

TopMenu = function() {	
	/*if there is no session id, just stop the toolbar.
	 This eliminated the bug in firefox pooping out code in the html code
 	*/
	/*
	if(window.location.href.match(/id=(\d+)/) == null)
	console.log(window.location.href.match(/id=(\d+)/));
		return;*/
	/*else continue buildin the toolbar*/
	
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


TopMenu.prototype.add = function(cpt) {
    var tm = this;

    tm.components.push(cpt);
    
	if(cpt.el)
		$(tm.el).append(cpt.el);
    else
		$(tm.el).append(cpt);

    cpt.parent = tm;
	
    if(tm.components.length > 0) 
		$(tm.el).show();
    else 
		$(tm.el).hide();

    return tm;
}

TM = new TopMenu();
