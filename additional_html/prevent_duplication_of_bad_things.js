"use strict";

/**
 * Attempts to remove a DOM element.
 * Returns true (success) or false (failure)
 */
function removeElement(htmlElement) {
    try {
        /* Yes, it really does take that much work to remove a DOM node */
        htmlElement.parentElement.removeChild(htmlElement);
        return true;
    } catch(e) {
        /* Ignore errors, return false */
        return false;
    }
}

/**
 * I may want to flesh this out a bit.
 */
function selectByCSS(selector) {
    /* Shorthand for document.querySelectorAll */

    /* Since this is supported on 90%+ of browsers, I think this is an acceptable shortcut */
    if(!document.querySelectorAll) {
        return [];
    } else {
        try {
            var matches = document.querySelectorAll(selector);
            /* I personally like the array methods, let's make them usable... */
            return Array.prototype.slice.call(matches);
        } catch(e) {
            return [];
        }
    }
}

function removeModButtonsOnActivityType(action, activityType) {
    /* Right now, at least, make the user of this function specify both an
     * action (e.g. duplicate) and an activity type (e.g. duplicate, update).
     */
    if(!activityType) return false;
    if(!action) return false;

    /* Use a CSS selector to grab these -- much easier than crawling the DOM */
    var selector = ".modtype_" + activityType + " .editing_" + action;
    var matchingButtons = selectByCSS(selector);

    for(var i = 0; i < matchingButtons.length; i++) {
        var button = matchingButtons[i];
        removeElement(button);
    }
}

function removeParentOfMatchingElement(selector, parentFilter) {
    try {
        var matches = selectByCSS(selector);
        if(!matches.length) {
            matches = selectByCSS(selector.toLowerCase());
        }
        for(var i = 0; i < matches.length; i++) {
            var elem = matches[i];
            do {
                var elem = elem.parentElement;
            } while(!parentFilter(elem));
            removeElement(elem);
        }
        return true;
    } catch(e) {
        return false;
    }
}

function preventRestoreOfActivityType(activityType) {
    /* We only really care if we're on the restore page... */
    if(!window.location.toString().match(/restore\.php/g)) return;

    var selector = 'td.modulename img[title*="' + activityType + '"]';
    var parentFilter = function(elem) { return elem.tagName.match(/tr/gi); }
    removeParentOfMatchingElement(selector, parentFilter);

    var selector = '.grouped_settings.activity_level input[name*="' + activityType + '"]';
    var parentFilter = function(elem) { return elem.className.match(/grouped_settings\s+activity_level/gi); }
    removeParentOfMatchingElement(selector, parentFilter);

    var selector = '.grouped_settings.activity_level img[title*="' + activityType + '"]';
    var parentFilter = function(elem) { return elem.className.match(/grouped_settings\s+activity_level/gi); }
    removeParentOfMatchingElement(selector, parentFilter);
}

function preventImportOfActivityType(activityType) {
    /* We only really care if we're on the import page... */
    if(!window.location.toString().match(/import\.php/g)) return;

    var selector = '.grouped_settings.activity_level img[title*="' + activityType + '"]';
    var parentFilter = function(elem) { console.log(elem); return elem.className.match(/grouped_settings\s+activity_level/gi); }
    removeParentOfMatchingElement(selector, parentFilter);
}
