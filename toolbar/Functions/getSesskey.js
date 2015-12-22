// Require: jquery.min.js

function getSesskey() {
    var $linkWithSesskey = $('a[href*="sesskey"]');
    var href = $linkWithSesskey.attr('href');
    var sesskey = href.match(/sesskey=([\w\d]+)/)[1];
	//console.log(sesskey);
    return sesskey;
}
