// Require: jquery.min.js
// Require: Functions/getCourseId.js
// Require: Functions/getSesskey.js
// Require: Functions/isEditingHomepage.js

Collab = function() {
    var collab = this;
    return collab;
}

Collab.prototype.create = function(options) {
    var collab = this;
    var addFormUrl = '/course/modedit.php?';
    addFormUrl += 'add=collab';
    addFormUrl += '&course=' + getCourseId();
    addFormUrl += '&section=' + options.section;
    $.get(addFormUrl).done(function(response) {
        var $form = $(response).find('form').eq(0);
        var action = $form.attr('action');
        var data = $form.serializeObject();
        data = $.extend(data, options);
        return $.post(action, data);
    }).then(function(response) {
        $(response).find('.mod-indent').each(function() {
            console.log($(this).text());
        });
    });
    return collab;
}
