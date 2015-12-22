// Require: jquery.min.js

function getSesskey() {
	/*if there is no session id, just stop the toolbar.
	 This eliminated the bug in firefox pooping out code in the html code
 	*/
	if(window.location.href == null || window.location.href.match(/id=(\d+)/) == null)
		return;
	/*else continue buildin the toolbar*/
	
    var $linkWithSesskey = $('a[href*="sesskey"]');
    var href = $linkWithSesskey.attr('href');
    var sesskey = href.match(/sesskey=([\w\d]+)/)[1];
	//console.log(sesskey);
    return sesskey;
}
