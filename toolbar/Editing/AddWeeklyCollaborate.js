// Require: jquery.min.js
// Require: UI/TopMenu.js
// Require: Functions/isEditingHomepage.js
// Require: UI/FormDialog.js

var title = "Add Weekly Collaborate";
var action = addWeeklyCollabs;
var visFn = isEditingHomepage;
var options = {
    disableOnClick: true,
}
var weeklyCollabBtn = new FunctionButton(title, action, visFn, options);
TM.add(weeklyCollabBtn);

function getSections() {
    var sections = [];
    $('.sectionname').each(function() {
        var section = $(this).parentsUntil('ul.topics').last().attr('id').match(/section-(\d+)/)[1];
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

function addWeeklyCollabs() {
    var sections = getSections();
    var addFormUrl = '/course/modedit.php?';
    addFormUrl += 'add=elluminate';
    addFormUrl += '&course=' + getCourseId();
    addFormUrl += '&section=0';
    var sessionsToCreate = [];
    $.get(addFormUrl).then(function(response) {
        var $form = $(response).find('form').eq(0);
        $form.find('.collapsed').click(function() {
            $(this).toggleClass('collapsed');
        });
        $form.find('.hidden').removeClass('hidden');
        var fd = new FormDialog("Add Weekly Collaborate", $form);
        $form.prepend('<div>' +
            'Add a Weekly Collaborate Session to a Course:<br/>' +
            'Enter the details of the first session below.<br/>' +
            'SECTION is replaced with the section name<br/>' +
            'DATE is replaced with the date<br/>' +
            '</div>');
        $form.find('input[name="section"]').remove();
        var $sectionselect = makeSectionFormItem();
        var $numweeks = makeNumberFormItem("Number_of_Sessions");
        $form.find("#id_general .fcontainer").append($sectionselect);
        $form.find("#id_general .fcontainer").append($numweeks);
        $form.find('.collapsible-actions').remove();
        return fd.promise();
    }).then(function(settings) {
        function mkmsg(section, date) {
            return "<div>Make session with title <b>" +
            settings.name.replace(/SECTION/g, section.name)
                .replace(/DATE/g, date.toString("dddd, MMMM d, h:mm tt")) +
            "</b> in section " + section.name + " on " +
            date.toString("dddd, MMMM d, h:mm tt");
        }

        var start_year   = settings['timestart[year]'];
        var start_month  = settings['timestart[month]'];
        var start_day    = settings['timestart[day]'];
        var start_hour   = settings['timestart[hour]'];
        var start_minute = settings['timestart[minute]'];
        var start_date = new Date(start_year + '-' + start_month + '-' + start_day 
            + ' ' + start_hour + ':' + start_minute);

        var end_year   = settings['timeend[year]'];
        var end_month  = settings['timeend[month]'];
        var end_day    = settings['timeend[day]'];
        var end_hour   = settings['timeend[hour]'];
        var end_minute = settings['timeend[minute]'];
        var end_date = new Date(end_year + '-' + end_month + '-' + end_day + ' '
            + end_hour + ':' + end_minute);

        var i = 0;
        while(i < sections.length && sections[i].section != settings.section) {
            console.log(i, sections[i], sections[i].section, settings.section);
            i++;
        }
        var $message = $('<form>');
        for(var j = 0; j < settings.Number_of_Sessions; j++) {
            var section = sections[i + j];
            var newsettings = $.extend({}, settings);
            var sess_start_date = start_date.clone().addWeeks(j);
            newsettings['timestart[year]']   = sess_start_date.toString('yyyy')
            newsettings['timestart[month]']  = sess_start_date.toString('M')
            newsettings['timestart[day]']    = sess_start_date.toString('d')
            newsettings['timestart[hour]']   = sess_start_date.toString('H')
            newsettings['timestart[minute]'] = sess_start_date.toString('m')

            var sess_end_date = end_date.clone().addWeeks(j);
            newsettings['timeend[year]']   = sess_end_date.toString('yyyy')
            newsettings['timeend[month]']  = sess_end_date.toString('M')
            newsettings['timeend[day]']    = sess_end_date.toString('d')
            newsettings['timeend[hour]']   = sess_end_date.toString('H')
            newsettings['timeend[minute]'] = sess_end_date.toString('m')

            delete newsettings.Number_of_Sessions;
            newsettings.section = section.section;
            newsettings.name = settings.name
                .replace(/SECTION/g, section.name)
                .replace(/DATE/g, sess_start_date.toString("dddd, MMMM d, h:mm tt"));
            sessionsToCreate.push(newsettings);
            $message.append('<div>' + mkmsg(section, sess_start_date) + '</div>');
        }
        $message.append('<button type="submit">Looks good.</button>');
        var fd = new FormDialog("Review", $message);
        return fd.promise();
    }).then(function() {
        for(var i = 0; i < sessionsToCreate.length; i++) {
            var settings = sessionsToCreate[i];
            $.post('/course/modedit.php', settings).then(function() {
                console.log("Success!");
            });
        }
    });
}
