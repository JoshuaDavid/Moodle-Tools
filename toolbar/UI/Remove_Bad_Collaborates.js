// Require: ./jquery.min.js
// Require: ./UI/FunctionButton.js
// Require: ./UI/ContextMenu.js
// Require: ./UI/TopMenu.js

if(window.location.pathname.match(/\/grade/)) {
    var nukebutton = new FunctionButton(
            "Remove Collaborate Sessions from Gradebook",
            nuke_collabs);
    TM.add(nukebutton);
}

function matches(attr, regexp) {
    return (function(string) {
        return this[attr].match(regexp) 
    });
} 

function updateFormWithParam(url, param) {
    var d = $.Deferred();
    var p = d.promise();
    $.get(url).success(function(response) {
        var $form = $(response).find('form');
        var action = '/course/modedit.php';
        var data = $form.serialize() + '&' + param;
        $.post(action, data).success(function(response) {
            d.resolve(response);
        });
    }); 
    return p;
}

function nuke_session(collab_id) {
    var updateUrl = "/course/modedit.php?update=" + collab_id;
    updateFormWithParam(updateUrl, 'gradesession=1')
    .then(function() {
        updateFormWithParam(updateUrl, 'gradesession=0');
    }).then(function() {
        $('a[title*="Collaborate"][href$="id='+collab_id+'"]')
        .parentsUntil('tbody').remove();
    });
}

function nuke_collabs() {
    $('a')
    .filter(matches('title', /collaborate/gi))
    .on('contextmenu', function(e) {
        e.preventDefault();
        var link = e.target;
        var id = e.target.href.match(/id=(\d+)/)[1];
        var cm = new ContextMenu(e.pageX, e.pageY, [{
            title: "Remove from gradebook",
            fn: function() { nuke_session(id) }
        }]);
    });
}
