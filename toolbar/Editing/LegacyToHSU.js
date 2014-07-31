// Require: jquery.min.js
// Require: UI/TopMenu.js
// Require: Functions/isEditingHomepage.js


// Converts the legacy forums to HSU forums
var title = "Replace Legacy Forums with New Forums";
var action = replaceAllLegacyWithHSU;
var visFn = isEditingHomepage;
var options = {
    disableOnClick: true,
}
var legToHSUBtn = new FunctionButton(title, action, visFn, options);
TM.add(legToHSUBtn);

function replaceOneLegacyWithHSU(legid) {
    var legacySettings, hsuSettings, section, title, courseId, addurl,
        $leg, $hsu, hsuid, $icon, moveParams;
    $.get('/course/modedit.php?update=' + legid).then(function(response) {
        legacySettings = $(response).find('form').serializeObject();
        section = legacySettings['section'];
        title = legacySettings['name'];
        if(title.match(/News Forum/gi) || title.match(/Announcements/gi)) {
            var d = $.Deferred();
            var p = d.promise();
            // Just never resolve. There's probably a better way of doing
            // this though.
            d.reject("Do not convert News Forum.");
            return p;
        }
        courseId = getCourseId();
        addurl = '/course/modedit.php?add=hsuforum&course=' + courseId;
        addurl += '&section=' + section;
        return $.get(addurl);
    }).then(function(response) {
        hsuSettings = $(response).find('form').serializeObject();
        for(var key in legacySettings) {
            if(hsuSettings[key] == "") {
                hsuSettings[key] = legacySettings[key];
            } else if(legacySettings[key] == legid) {
            } else if(key == "modulename" || key == "module") {
            } else if(hsuSettings[key] == legacySettings[key]) {
            } else if(hsuSettings[key] !== undefined) {
                hsuSettings[key] = legacySettings[key];
            } else {
            }
            hsuSettings["add"] = "hsuforum";
        }
        return $.post(addurl, hsuSettings);
    }).then(function(response) {
        $hsu = findActivityInHtml(response, section, "hsuforum", title); 
        if($hsu === null) {
            console.log($(response).find('body')[0]);
            return;
        }
        hsuid = $hsu.find('.activityinstance a').attr('href')
            .match(/id=(\d+)/)[1];
        $('#section-' + section + 'ul').append($hsu);
        $.get('/course/mod.php?hide=' + legid + '&sesskey=' + getSesskey()); 
        return moveModuleBefore(hsuid, legid, section);
    }).then(function() {
        $leg = $('#module-' + legid);
        $hsu = $leg.clone();
        $hsu.insertBefore($leg);
        $hsu.attr('id', 'module-' + hsuid);
        $icon = $hsu.find('img.activityicon');
        $icon.attr('src', $icon.attr('src').replace("forum", "hsuforum"));
        $hsu.find('a').each(function() {
            this.href = this.href.toString().replace(legid, hsuid);
        });
        $leg.find('.activityinstance a').addClass('dimmed');
        $leg.find('.editing_hide img').each(function() {
            this.src = this.src.toString().replace('hide', 'show');
        });
    });
}

function moveModuleBefore(module_id, before_id, section) {
    var moveParams = { 
        sesskey: getSesskey(),
        courseId: getCourseId(),
        class: "resource",
        field: "move",
        id: module_id,
        sectionId: section,
        beforeId: before_id
    };
    return $.post('/course/rest.php', moveParams).then(function() {
        var d = $.Deferred();
        var p = d.promise();
        $('#module-' + module_id).insertBefore('#module-' + before_id);
        d.resolve();
        return p;
    });
}

function replaceAllLegacyWithHSU() {
    $('.activity.forum').each(function() {
        $forum = $(this);
        var href = $forum.find('.activityinstance a').attr('href');
        var id = href.match(/id=(\d+)/)[1];
        replaceOneLegacyWithHSU(id);
    });
}

function deleteAllHSU() {
    $('.activity.modtype_hsuforum').each(function() {
        var $module = $(this);
        var id = $module.attr('id').match(/module-(\d+)/)[1];
        var url = '/course/mod.php';
        url += '?delete=' + id;
        url += '&confirm=1';
        url += '&sr=0';
        url += '&sesskey=' + getSesskey();
        $.get(url).then(function() { $module.remove() });
    });
}
