// Require: jquery.min.js
// File Name getCourseId.js

function getCourseId() {
   // Grab the course id from the address bar in the current page
   // the match function returns an array of string values
   // the second index is the int value that we need
    var courseid = window.location.href.match(/id=(\d+)/)[1];
	console.log(window.location.href);
    return courseid;
}
