// Require: jquery.min.js
// Require: UI/TopMenu.js
// Require: Functions/isEditingHomepage.js
// Require: UI/FormDialog.js

var title = "Put Collaborate On Smartsheet";
var action = putCollaboratesOnSmartsheet;
var visFn = isEditingHomepage;
var options = {
    disableOnClick: false,
}
var collab2smartsheet = new FunctionButton(title, action, visFn, options);
TM.add(collab2smartsheet);

function putCollaboratesOnSmartsheet() {
    sessions = [];
    var promised_courseinfo = getCourseAttributes();
    var num_sessions = $('.elluminate').length;
    $('.elluminate').each(function() {
        var session = {};
        session["Link"] = $(this).find('.activityinstance a').attr('href');
        var updateLink = $(this).find('.editing_update').attr('href');
        $.get(updateLink).then(function(response) {
            var $form = $(response).find('form');
            session["Week # / Title"] = $form.find('#id_name').val();
            session["Date"] = $form.find('#id_timestart_year').val() + '-' + $form.find('#id_timestart_month').val() + '-' + $form.find('#id_timestart_day').val();
            session["Time"] = $form.find('#id_timestart_hour').val() + '-' + $form.find('#id_timestart_minute').val();
            session["Day"] = new Date(session["Date"] + ' 00:00:00').getDayName();
            sessions.push(session);
            if(sessions.length == num_sessions) {
                promised_courseinfo.then(function(courseinfo) {
                    console.log(sessions, courseinfo);
                    var $s = $('<script/>');
                    $('head').append($s);
                    var callbackName = "";
                    for(var i = 0; i < 10; i++) {
                        callbackName += "qwertyuiopasdfghjklzxcvbnm"[0 | Math.random() * 26];
                    }
                    window[callbackName] = function(href) {
                        var $form = $('<form></form>')
                            .append($('<div/>').html("Sheet is ").append(
                                    $('<a/>').html("here").attr('href', href).css({
                                        'color': 'blue',
                                        'text-decoration': 'underline'
                                    })))
                            .append($('<button type="submit"/>').html("Ok"));
                        new FormDialog("Smartsheet Sheet Created", $form)
                        window[callbackName] = undefined;
                    }
                    var src = "https://localhost/js/Moodle/toolbar/add_spreadsheet.php?" + 
                        "courseinfo=" + encodeURIComponent(JSON.stringify(courseinfo)) + 
                        "&sessions=" + encodeURIComponent(JSON.stringify(sessions)) + 
                        "&callback=" + callbackName;
                    $s.attr("src", src);
                });
            }
        });
    });
}

