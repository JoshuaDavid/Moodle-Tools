// ==UserScript==
// @name       Bring Back the Editing Icons
// @namespace  http://use.i.E.your.homepage/
// @version    0.1
// @description Brings Back the Editing Icons
// @match      https://moodle.csun.edu/course/*
// @copyright  2014+, Josh
// ==/UserScript==

function withJquery(callback) {
    if(window.jQuery) {
        callback(window.jQuery);
    } else {
        var jq = document.createElement("script");
        jq.src = "https://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js";
        jq.onload = function() {
            callback(window.jQuery);
        };
        document.head.appendChild(jq);
    }
}

withJquery(show_editing_icons);

function show_editing_icons(jQuery) {
    $('.mod-indent-outer').each(function() { 
        var $activity = $(this);
        var $options = $activity.find('ul.menu a.menu-action');
        $options.each(function() {
            var $option = $(this);
            $option.attr("title", $option.text());
            $option.find('span').html("");
        });
        var $option_ctr = $('<div class="menu-options"/>');
        $option_ctr.append($options);
        $activity.append($option_ctr);
        $activity.find('ul.menubar').hide();
    });
}
