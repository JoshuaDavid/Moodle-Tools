// Require: jquery.min.js
// File Name getCourseId.js

function getCourseId() {
   // Grab the course id from the address bar in the current page
   // the match function returns an array of string values
   // the second index is the int value that we need
	
	/*if there is no session id, just stop the toolbar.
	 This eliminated the bug in firefox pooping out code in the html code
 	*/
	if(window.location.href == null || window.location.href.match(/id=(\d+)/) == null)
		return;
	/*else continue buildin the toolbar*/
	
    var courseid = window.location.href.match(/id=(\d+)/)[1];
	
	/*
	if(window.location.href.match(/id=(\d+)/) == null)
	   var coursid = "";
    else
   	   var courseid = window.location.href.match(/id=(\d+)/)[1];
	*/
	
    return courseid;
}
