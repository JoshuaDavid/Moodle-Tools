/* Check the "display word count" box on all forums with a name like Week X Group Y. Not extremely useful
 * by itself, but very easy to modify to do other things.
 */
javascript:void (function () { "use strict"; var delay = 0, between = 3000, $, addWordcountToMatchingForums; function addJqueryThen(next) { var jq = document.createElement('script'); jq.addEventListener("load", function () { $ = window.jQuery; next(); }); jq.src = window.location.protocol + "//code.jquery.com/jquery.min.js"; document.head.appendChild(jq); } function applyActionToMatchingActivities(action, selector, matchFn) { $(selector).filter(matchFn).each(action); } function matchFn() { return this.textContent.toString().match(/Week\s*\d+\s*-\s*Group\s*\d+/g); } function objectify(rootobj, keyValPair) { rootobj[keyValPair.name] = keyValPair.value; return rootobj; } function addWordCountToForum() { var $forum = $(this), href = $forum.find(".editing_update").attr('href'); $forum.css('background', '#ffcccc'); setTimeout($.get.bind($), delay, href, function (response) { $forum.css('background', '#ffff77'); var $form = $(response).find('form'), action = $form.attr('action'), data = $form.serializeArray().reduce(objectify, {}); data.displaywordcount = 1; setTimeout($.post.bind($), delay, action, data, function () { $forum.css('background', '#77ccff'); }); delay += between; }); delay += between; } addWordcountToMatchingForums = applyActionToMatchingActivities.bind(this, addWordCountToForum, '.activity.forum', matchFn); addJqueryThen(addWordcountToMatchingForums); }());
