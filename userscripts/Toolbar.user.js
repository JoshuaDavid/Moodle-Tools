// ==UserScript==
// @name       Moodle Toolbar
// @namespace  http://use.i.E.your.homepage/
// @version    0.1
// @description  Toolbar with many useful functions
// @match      https://moodle.csun.edu/*
// @copyright  2014+, You
// ==/UserScript==

var script = document.createElement('script');
script.src = "https://localhost/js/Moodle/toolbar/concatjs.php";
document.head.appendChild(script);
