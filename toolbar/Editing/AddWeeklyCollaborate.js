// Require: jquery.min.js
// Require: UI/TopMenu.js
// Require: Functions/isEditingHomepage.js
// Require: UI/FormDialog.js

var title = "Add Weekly Collaborate";
var action = addWeeklyCollabs;
var visFn = isEditingHomepage;
var options = {
    disableOnClick: false,
}
var weeklyCollabBtn = new FunctionButton(title, action, visFn, options);
TM.add(weeklyCollabBtn);

function getSections() {
    var sections = [];
    $('.sectionname').each(function() {
        var section = $(this).parentsUntil('ul.topics, ul.weeks').last().attr('id').match(/section-(\d+)/)[1];
        var name = $(this).text();
        sections.push({section:section, name:name});
    });
    return sections;
}

function makeNumberFormItem(name) {
    var $outer = $('<div id="fitem_id_' + name + '" class="fitem required fitem_fselect"/>');
    var $labelholder = $('<div class="fitemtitle"/>');
    var $label = $('<label for="id_' + name + '"/>');
    $label.text(name.replace(/_/g, ' ') + '*');
    var $inputholder = $('<div class="felement fselect"/>');
    var $input = $('<input name="' + name + '" id="id_' + name + '"/>');
    $inputholder.append($input);
    $labelholder.append($label);
    $outer.append($labelholder);
    $outer.append($inputholder);
    return $outer;
}

function makeSectionFormItem() {
    var $outer = $('<div id="fitem_id_section" class="fitem required fitem_fselect"/>');
    var $labelholder = $('<div class="fitemtitle"/>');
    var $label = $('<label for="id_section"/>');
    $label.text("Start Section*");
    var $inputholder = $('<div class="felement fselect"/>');
    var $sectionselect = $('<select name="section" id="id_section"/>');
    var sections = getSections();
    for(var i = 0; i < sections.length; i++) {
        $sectionselect.append('<option value="' + sections[i].section + '">' + sections[i].name + '</option>');
    };
    $inputholder.append($sectionselect);
    $labelholder.append($label);
    $outer.append($labelholder);
    $outer.append($inputholder);
    return $outer;
}

// Takes the "Create New Collaborate Session" page (as a jquery object)
// and, optionally, some session settings. Returns a form (again as a jquery
// object) which gives the appropriate options.
function createCollabForm($form, settings) {
    var $description = $('<div>' +
            'Add a Weekly Collaborate Session to a Course:<br/>' +
            'Enter the details of the first session below.<br/>' +
            '[[SECTION]] is replaced with the section name<br/>' +
            '[[DATE]] is replaced with the date<br/>' +
            '[[SESSIONNUM]] is replaced with the session number (e.g. ' + 
            '"Week [[SESSIONNUM]] Session" becomes "Week 1 Session", "Week 2 Session", etc.)<br/>' +
            '<b>Session for [[SECTION]] ([[DATE]])</b> would become ' +
            '<b>Session for Topic 1 (Tuesday, September 2, 2:15pm)</b>' +
            ' (or whatever the correct date is) automatically -- you don\'t have to' +
            ' enter the dates or section names yourself in the title.' + '<b><b> Remove ([[DATE]]) if you do not need it' +
            '</div>');
    $form.prepend($description);
    $form.find('input[name="section"]').remove();
    var $sectionselect = makeSectionFormItem();
    var $numweeks = makeNumberFormItem("Number_of_Sessions");
    $form.find("#id_general .fcontainer").append($sectionselect);
    $form.find("#id_general .fcontainer").append($numweeks);
    $form.find('.collapsible-actions').remove();
    $form.find('.collapsed').click(function() {
        $(this).toggleClass('collapsed');
    });
    $form.find('#id_telephony_formvalue').attr('checked', null);
    $form.find('#id_submitbutton2').remove();
    $form.find('#id_submitbutton').val('Continue');

    for(var key in settings) {
        $form.find('[name="' + key + '"]').val(settings[key]);
    }
    return $form;
}

function addWeeklyCollabs(settings) {
    var sections = getSections();
    if(settings === undefined) settings = {};
    var addFormUrl = '/course/modedit.php?';
    addFormUrl += 'add=elluminate';
    addFormUrl += '&course=' + getCourseId();
    addFormUrl += '&section=0';
    var sessionsToCreate = [];
    var modlinks = [];
    $.get(addFormUrl).then(function(response) {
        var $form = $(response).find('form').eq(0);
        $form.find('.hidden').removeClass('hidden');
        $form = createCollabForm($form, settings);
        var fd = new FormDialog("Add Weekly Collaborate", $form);
        $form.find("#id_name").val("Week [[SESSIONNUM]] - Collaborate Session ([[DATE]])");
        $form.find('#id_cancel').click(function(e) {
            e.stopPropagation();
            e.preventDefault();
            fd.close();
        });
        return fd.promise();
    }).then(function(settings) {
        s = settings;
        function mkmsg(section, date) {
            return "<div>Make session with title <b>" +
            settings.name.replace(/\[\[SECTION\]\]/g, section.name)
                .replace(/\[\[SESSIONNUM\]\]/g, offset + 1)
                .replace(/\[\[DATE\]\]/g, date.toString("dddd, MMMM d, h:mm tt")) +
            "</b> in section " + section.name + " on " +
            date.toString("dddd, MMMM d, h:mm tt");
        }

        var start_year   = settings['timestart[year]'];
        var start_month  = parseInt(settings['timestart[month]']) - 1;
        var start_day    = settings['timestart[day]'];
        var start_hour   = settings['timestart[hour]'];
        var start_minute = settings['timestart[minute]'];
        var start_date = new Date(start_year, start_month, start_day, start_hour, start_minute, 0, 0);

        var end_year   = settings['timeend[year]'];
        var end_month  = parseInt(settings['timeend[month]']) - 1;
        var end_day    = settings['timeend[day]'];
        var end_hour   = settings['timeend[hour]'];
        var end_minute = settings['timeend[minute]'];
        var end_date = new Date(end_year, end_month, end_day, end_hour, end_minute, 0, 0);

        var startSection = 0;
        // Scan through the sections to find the correct one.
        while(startSection < sections.length 
                && sections[startSection].section != settings.section) {
            startSection++;
        }
        var $message = $('<form>');
        for(var offset = 0; offset < settings.Number_of_Sessions; offset++) {
            var section = sections[startSection + offset];
            var newsettings = $.extend({}, settings);
            var sess_start_date = start_date.clone().addWeeks(offset);
            newsettings['timestart[year]']   = sess_start_date.toString('yyyy')
            newsettings['timestart[month]']  = sess_start_date.toString('M')
            newsettings['timestart[day]']    = sess_start_date.toString('d')
            newsettings['timestart[hour]']   = sess_start_date.toString('H')
            newsettings['timestart[minute]'] = sess_start_date.toString('m')

            var sess_end_date = end_date.clone().addWeeks(offset);
            newsettings['timeend[year]']   = sess_end_date.toString('yyyy')
            newsettings['timeend[month]']  = sess_end_date.toString('M')
            newsettings['timeend[day]']    = sess_end_date.toString('d')
            newsettings['timeend[hour]']   = sess_end_date.toString('H')
            newsettings['timeend[minute]'] = sess_end_date.toString('m')

            delete newsettings.Number_of_Sessions;
            newsettings.section = section.section;
            newsettings.name = settings.name
                .replace(/\[\[SECTION\]\]/g, section.name)
                .replace(/\[\[SESSIONNUM\]\]/g, offset + 1)
                .replace(/\[\[DATE\]\]/g, sess_start_date.toString("dddd, MMMM d, h:mm tt"));
            sessionsToCreate.push(newsettings);
            $message.append('<div>' + mkmsg(section, sess_start_date) + '</div>');
        }
        var $continueBtn = $('<button type="submit">Looks good.</button>');
        var $backBtn = $('<button type="submit">No, take me back.</button>');
        var $cancelBtn = $('<button type="submit">Cancel</button>');
        $backBtn.click(function(e) {
            e.stopPropagation();
            e.preventDefault();
            fd.close();
            addWeeklyCollabs(settings);
        });
        $cancelBtn.click(function(e) {
            e.stopPropagation();
            e.preventDefault();
            fd.close();
        });
        $message.append([$continueBtn, $backBtn, $cancelBtn]);
        var fd = new FormDialog("Review", $message);
        return fd.promise();
    }).then(function() {
        var d = $.Deferred();
        var p = d.promise();
        var $progressForm = $('<form></form>');
        var $progressBar = $('<meter id="progess" min="0" value="0" />');
        var $task = $('<div/>');
        $progressBar.attr("max", sessionsToCreate.length);
        $progressForm.append($progressBar);
        $progressForm.append($task);
        var fd = new FormDialog("Creating sessions...", $progressForm);
        for(var i = 0; i < sessionsToCreate.length; i++) {
            var settings = sessionsToCreate[i];
            settings['submitbutton'] = "Save and display";
            var sessionIds = [];
            var numDone = 0;
            $task.html("Creating session <b>" + settings.name + "</b>.");
            (function(i) {
                $.post('/course/modedit.php', settings).then(function(response) {
                    sessionIds[numDone] = $(response).find('input[name="update"]').val();
                    numDone++;
                    $progressBar.val(numDone);
                    modlinks[i] = $(response).find('#elluminatelink a').attr('href');
                    if(i + 1 < sessionsToCreate.length) {
                        $task.html("Creating session <b>" + sessionsToCreate[i + 1].name + "</b>.");
                    } else {
                        $task.html("Sessions created.");
                        d.resolve();
                        fd.close();
                    }
                });
            })(i);
        }
        return p;
    }).then(function() {
        return $.get(modlinks[0]);
    }).then(function(response) {
        var $form = $(response).find("form#participantForm");
        $form.append($('<button type="submit">Done</button>'));
        var fd = new FormDialog("Add / Remove Moderators", $form);
        var $progress = $('<div>');
        $progress.hide();
        function freezeUI(n) {
            console.log("Freeze");
            $form.find('input[type="submit"], button, select').attr('disabled', 'true');
            $form.prepend($progress);
            $progress.show();
            $progress.html('0 of ' + n + ' done.');
        }
        function progress(m, n) {
            $progress.html(m + ' of ' + n + ' done.');
        }
        function unFreezeUI() {
            console.log("Unfreeze");
            $form.find('input[type="submit"], button, select').attr('disabled', null);
            $progress.hide();
        }
        $form.find('#addSubmit').click(function(e) {
            e.preventDefault();
            e.stopPropagation();
            var numDone = 0;
            freezeUI(modlinks.length);
            for(var i = 0; i < modlinks.length; i++) {
                (function(i) {
                    $form.find('select').attr('disabled', null);
                    var data = $form.serialize();
                    $form.find('select').attr('disabled', true);
                    var id = modlinks[i].match(/id=(\d+)/)[1];
                    data = data.replace(/id=\d+/, "id=" + id);
                    data += "&submitvalue=add";
                    $.post('/mod/elluminate/user-edit.php', data).then(function() {
                        console.log(data);
                        numDone += 1;
                        progress(numDone, modlinks.length);
                        if(numDone == modlinks.length) {
                            $('select[name^="availableUsers"] option').each(function() {
                                if(this.selected) {
                                    $(this).appendTo('select[name^="currentUsers"]');
                                }
                            });
                            unFreezeUI();
                        }
                    });
                })(i);
            };
        });
        $form.find('#removeSubmit').click(function(e) {
            e.preventDefault();
            e.stopPropagation();
            var numDone = 0;
            freezeUI(modlinks.length);
            for(var i = 0; i < modlinks.length; i++) {
                (function(i) {
                    $form.find('select').attr('disabled', null);
                    var data = $form.serialize();
                    $form.find('select').attr('disabled', true);
                    var id = modlinks[i].match(/id=(\d+)/)[1];
                    data = data.replace(/id=\d+/, "id=" + id);
                    data += "&submitvalue=remove";
                    $.post('/mod/elluminate/user-edit.php', data).then(function() {
                        console.log(data);
                        numDone += 1;
                        progress(numDone, modlinks.length);
                        if(numDone == modlinks.length) {
                            $('select[name^="currentUsers"] option').each(function() {
                                if(this.selected) {
                                    $(this).appendTo('select[name^="availableUsers"]');
                                }
                            });
                            unFreezeUI();
                        }
                    });
                })(i);
            };
        });
        return fd.promise();
    }).then(function() {
        window.location.reload();
    });
}
