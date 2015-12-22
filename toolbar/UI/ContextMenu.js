// Require: jquery.min.js

ContextMenu = function(x, y, options) {
	/*if there is no session id, just stop the toolbar.
	 This eliminated the bug in firefox pooping out code in the html code
 	*/
	if(window.location.href.match(/id=(\d+)/) == null)
		return;
	/*else continue buildin the toolbar*/	

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
        var $opt = $('<div/>');
        $opt.css({
            "background": "white",
            "border-bottom": "1px solid gray",
        });
        $opt.html(option.title);
        $opt.click(option.fn);
        $opt.click($ctxmenu.remove());
        $opt.on('mouseover', function(e) {
            // To avoid this always being the last option in the loop
            var $opt = $(e.target);
            $opt.css("background", "lightblue");
            $opt.on("mouseout", unhighlight);
            function unhighlight() {
                $opt.css("background", "white");
                $opt.off("mouseout", unhighlight);
            }
        });
        $ctxmenu.append($opt);
    }
    setTimeout(function() {
        $ctxmenu.remove();
    }, 5000);
    $('body').append($ctxmenu);
    return cm;
}
