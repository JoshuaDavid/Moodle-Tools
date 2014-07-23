// Require: jquery.min.js
// Require: Functions/getCourseId.js
// Require: Functions/getSesskey.js

Label = function() {
    var label = this;
    return label;
}

Label.prototype.defaultSettings = {
    "sesskey":                                          getSesskey(),
    "course":                                           getCourseId(),
    "coursemodule":                                     "",
    "update":                                           "",
    "conditiongraderepeats":                            "1",
    "conditionfieldrepeats":                            "1",
    "section":                                          "0",
    "module":                                           "1",
    "modulename":                                       "label",
    "add":                                              "0",
    "return":                                           "0",
    "sr":                                               "0",
    "_qf__mod_label_mod_form":                          "1",
    "mform_isexpanded_id_generalhdr":                   "1",
    "mform_isexpanded_id_modstandardelshdr":            "0",
    "mform_isexpanded_id_availabilityconditionsheader": "0",
    "introeditor[text]":                                "A label",
    "introeditor[format]":                              "1",
    "introeditor[itemid]":                              "0",
    "visible":                                          "1",
    "releasecode":                                      "",
    "showavailability":                                 "1"
} 


Label.prototype.create = function(options) {
    var label = this;
    var addFormUrl = '/course/modedit.php?';
    addFormUrl += 'add=label';
    addFormUrl += '&course=' + getCourseId();
    addFormUrl += '&section=' + options.section;
    var data = {};
    $.get(addFormUrl).then(function(response) {
        var $form = $(response).find('form').eq(0);
        var action = $form.attr('action');
        data = $form.serializeObject();
        data = $.extend(data, options);
        return $.post(action, data);
    }).then(function(response) {
        $res = $(response);
        var section = '#section-' + options.section;
        $(response).find(section + ' .section.img-text li.label')
        .each(function() {
            var $activity = $(this);
            var content = $activity.find('.no-overflow .no-overflow').html();
            if(content == data['introeditor[text]']) {
                $(section).find('.section.img-text').append($activity);
            }
        });
    });
    return label;
}
