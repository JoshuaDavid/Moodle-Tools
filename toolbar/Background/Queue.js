// Require: jquery.min.js

var $statusindicator = $("<div/>").css({
    "position": "fixed",
    "top": "0",
    "right": "0",
    "z-index": 1,
    "background": "white",
    "border": "1px solid black"
});
var $numPending = $('<span id="num-pending">0</span>');
$statusindicator.append($numPending);
$statusindicator.append("<span> requests pending</span>");

$('body').append($statusindicator);
$statusindicator.hide(0);

var queue = [];
queue.busy = false;
queue.next = function() {
    if(queue.length) {
        $('body').css('cursor', 'wait');
        $statusindicator.show(400);
        $numPending.html(queue.length);
        console.log("Next in queue");
        queue.shift()();
    } else {
        $numPending.html(queue.length);
        $statusindicator.hide(400);
        $('body').css('cursor', '');
    }
}
var oldget = $.get;
var oldpost = $.post;
$.get = function() {
    var d = $.Deferred();
    var p = d.promise();
    var args = arguments;
    function f() {
        queue.busy = true;
        oldget.apply($, args).always(function(res) {
            queue.busy = false;
            queue.next();
            d.resolve(res);
        });
    }
    queue.push(f);
    if(!queue.busy) {
        queue.next();
    }
    return p;
}
$.post = function() {
    var d = $.Deferred();
    var p = d.promise();
    var args = arguments;
    function f() {
        queue.busy = true;
        oldpost.apply($, args).always(function(res) {
            queue.busy = false;
            queue.next();
            d.resolve(res);
        });
    }
    queue.push(f);
    if(!queue.busy) {
        queue.next()
    }
    return p;
}
