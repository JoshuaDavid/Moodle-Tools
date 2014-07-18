/* Shows all of the *hidden* fields in a Moodle form. Generally, this is not something
 * you want to mess with, but if for example you want to change what section an item
 * is in from the editing page, you can do that quite easily.
 *
 * This script is particularly useful combined with the Submit_Without_Page_Change script, because
 * it lets you create a Collaborate session, and then click Submit_Without_Page_Change, then move one 
 * week forward with the dates and up by one on the section.
 */
javascript:void (function() { var jq = document.createElement("script"); jq.src=window.location.protocol + "//code.jquery.com/jquery.min.js"; jq.onload = function() { (function($) { $('.collapsed').removeClass('collapsed'); $('input[type="hidden"]').each(function() { var $container = $(this).attr('type', 'text').wrap('<div class="fcontainer"/>'); var $item = $container.wrap('<div class="fitem"/>'); var $input = $item.wrap('<div class="felement ftext"/>'); var $title = $('<div class="fitemtitle"/>'); $title.prependTo($(this).parentsUntil('.fcontainer')); var $label = $('<label/>').attr('for', this.name).html(this.name).appendTo($title); $container.parentsUntil('html').show(); }); }(jQuery)); }; document.head.appendChild(jq); }());
