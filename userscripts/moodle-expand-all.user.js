// ==UserScript==
// @name        Moodle Expand All
// @namespace   https://moodle.csun.edu/*
// @description Clicks the "Expand All" button when adding or editing activities
// @include     https://moodle.csun.edu/*
// @version     1
// @grant       none
// ==/UserScript==

(function() {
    function click(elem) {
        var evt = document.createEvent('MouseEvents');
        evt.initMouseEvent('click', true, true, window, 0, 1, 1, 1, 1, false, false, false, false, 0, null);
        elem.dispatchEvent(evt);
    }
    if(document.readyState == "complete") expandAll();
    else document.addEventListener("DOMContentLoaded", expandAll);
    function cssSelect(selector) {
        return Array.prototype.slice.call(document.querySelectorAll(selector));
    }
    function innerTextMatches(regex) {
        return function(el) {
            return el.innerText.toString().match(regex);
        }
    }
    function expandAll() {
        var expandLinks = cssSelect('.collapseexpand');
        var expandAllLinks = expandLinks.filter(function(el) {
            return el.textContent.toString().match(/expand\s+all/gi);
        });
        var expandAllLink = expandAllLinks[0] || undefined;
        if(expandAllLink) {
            if(expandAllLink.tagName.match(/^a$/gi)) {
                click(expandAllLink);
            } else {
                setTimeout(expandAll, 100);
            }
        }
    }
}());
