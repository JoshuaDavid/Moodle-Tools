// Require: jquery.min.js
// Require: UI/TopMenu.js
// Require: Functions/isEditingHomepage.js


// Converts the legacy forums to HSU forums
var title = "Replace Legacy Forums with HSU Forums";
var action = replaceAllLegacyWithHSU;
var visFn = isEditingHomepage;
var options = {
    disableOnClick: true,
}
var legToHSUBtn = new FunctionButton(title, action, visFn, options);
TM.add(legToHSUBtn);

function replaceOneLegacyWithHSU(id) {
    $.get('/course/modedit.php?update=' + id).then(function(response) {
        var legacySettings = $(response).find('form').serializeObject();
        var section = legacySettings['section'];
        var title = legacySettings['name'];
        var courseId = getCourseId();
        $.get('/course/modedit.php?add=hsuforum&course=' + courseId + '&section=' + section)
        .then(function(response) {
            var hsuSettings = $(response).find('form').serializeObject();
            for(var key in legacySettings) {
                if(hsuSettings[key] === "") {
                    hsuSettings[key] = legacySettings[key];
                }
            }
            $.post('/course/modedit.php', hsuSettings).then(function(response) {
                var $hsu = findActivityInHtml(response, section, "hsuforum", title); 
                if($hsu === null) {
                    return;
                }
                var hsuid = $hsu.find('.activityinstance a').attr('href')
                .match(/id=(\d+)/)[1];
                $.get('/course/mod.php?hide=' + id + '&sesskey=' + getSesskey()); 
                var params = { 
                    sesskey: getSesskey(),
                    courseId: courseId,
                    class: "resource",
                    field: "move",
                    id: hsuid,
                    sectionId: section,
                    beforeId: id
                };
                $.post('/course/rest.php', params).then(function() {
                    var $leg = $('#module-' + id);
                    var $hsu = $leg.clone();
                    $hsu.insertBefore($leg);
                    $hsu.attr('id', 'module-' + hsuid);
                    var $icon = $hsu.find('img.activityicon');
                    $icon.attr('src', $icon.attr('src').replace("forum", "hsuforum"));
                    $hsu.find('a').each(function() {
                        this.href = this.href.toString().replace(id, hsuid);
                    });
                    $leg.find('.activityinstance a').addClass('dimmed');
                    $leg.find('.editing_hide img').each(function() {
                        this.src = this.src.toString().replace('hide', 'show');
                    });
                });
            })
        });
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
