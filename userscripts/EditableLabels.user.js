// ==UserScript==
// @name       Editable Moodle Labels
// @namespace  http://jsdavid.com/
// @version    0.1
// @description  Make labels editable in Moodle
// @match      https://moodle.csun.edu/*
// @copyright  2012+, You
// ==/UserScript==


(function() {
    jq = document.createElement("script");
    jq.src = window.location.protocol + "//ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js";
    jq.setAttribute("defer", "defer");
    jq.onload = function() {
        var HTML_FORMAT = 1;

        var $labels = $('.activity.label');
        $labels.each(function() {
            var $label = $(this);
            var $updateButton = $label.find('a[href*="update"]');
            if(!$updateButton.length) return false;
            var updateURL = $updateButton.attr("href");
            var $labelContent = $label.find('.no-overflow .no-overflow');
            $labelContent.click(function() {
                $labelContent.attr('contentEditable', 'true');
                $labelContent.focus();
                $labelContent.focusout(function() {
                    $labelContent.attr('contentEditable', 'false');
                    var newHTML = $labelContent.html();
                    $label.css('background', 'lightgray');
                    $.get(updateURL, function(response) {
                        var $form = $(response).find('form');
                        var data = $form.serializeArray();
                        var action = $form.attr('action');
                        for(var i = 0; i < data.length; i++) {
                            if(data[i].name == "introeditor[text]") {
                                data[i].value = newHTML;
                            }
                            if(data[i].name == "introeditor[format]") {
                                data[i].value = HTML_FORMAT;
                            }
                        }
                        $.post(action, data, function() {
                            $label.css('background', '');
                        });
                    });
                });
            });
        });
    }
    document.head.appendChild(jq);
}())
