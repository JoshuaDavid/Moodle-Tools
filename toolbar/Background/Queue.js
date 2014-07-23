// Require: jquery.min.js

var queue = [];
queue.busy = false;
queue.next = function() {
    if(queue.length) {
        console.log("Next in queue");
        queue.shift()();
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
            if(queue.length) queue.shift()();
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
        queue.shift()();
    }
    return p;
}
