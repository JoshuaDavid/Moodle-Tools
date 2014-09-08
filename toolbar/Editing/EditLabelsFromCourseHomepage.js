// Require: jquery.min.js
// Require: UI/TopMenu.js
// Require: Functions/isEditingHomepage.js


var title = "Edit Labels";
var action = makeLabelsEditable;
var visFn = isEditingHomepage;
var options = {
    disableOnClick: true,
}
var labelEdBtn = new FunctionButton(title, action, visFn, options);
TM.add(labelEdBtn);

edithandlers = [];

function makeLabelsEditable() {
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

function makeTitlesEditable() {
    $('.activity:not(.label)').each(function() {
        var $activity = $(this);
        var id = $activity.attr('id').match(/module-(\d+)/)[1];
    });
}

function change_title(id, new_title) {
    $.get('/course/modedit.php?update=' + id).then(function(response) {
        var $form = $response.find('form#mform1');
        var data = $form.serializeObject();
        data["name"] = newtitle;
        return $.post('/course/modedit.php', data);
    }).then(function(response) {
    });
}
