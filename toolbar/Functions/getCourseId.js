// Require: jquery.min.js
// File Name getCourseId.js

function getCourseId() {
   // Grab the course id from the address bar in the current page
   // the match function returns an array of string values
   // the second index is the int value that we need
   // console.log(window.location.href); //debug line
	if(window.location.href.match(/id=(\d+)/) == null)
		return;
    var courseid = window.location.href.match(/id=(\d+)/)[1];
	
	/*
	if(window.location.href.match(/id=(\d+)/) == null)
	   var coursid = "";
    else
   	   var courseid = window.location.href.match(/id=(\d+)/)[1];
	*/
	
    return courseid;
}
