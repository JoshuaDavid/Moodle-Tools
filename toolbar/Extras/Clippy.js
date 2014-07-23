// Require: jquery.min.js

$('<link rel="stylesheet" href="//www.csun.edu/exlinfo/js/clippy/build/clippy.css" />')
    .appendTo('head');
$('<script src="//www.csun.edu/exlinfo/js/clippy/build/clippy.js" />')
    .appendTo('head');

function clippify() {
    if(window.clippy) {
        clippy.load('Clippy', function(agent) {
            window.Helper = agent;
            var oldget = $.get;
            _oldget = oldget;
            var oldpost = $.post;
            _oldpost = oldpost;
            $.get = function() {
                Helper.stop();
                Helper.play('CheckingSomething');
                var res = oldget.apply($, arguments);
                res.done(function() {
                    Helper.stop();
                    // Helper.play("Congratulate");
                });
                return res;
            }
            $.post = function() {
                Helper.stop();
                Helper.play('SendMail');
                var res = oldpost.apply($, arguments);
                res.done(function() {
                    Helper.stop();
                    Helper.play("Congratulate");
                });
                return res;
            }
            agent.show();
        });
    } else {
        setTimeout(clippify, 100);
    }
}

clippify();
