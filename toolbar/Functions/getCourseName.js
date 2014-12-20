// Require: jquery.min.js

function getCourseName() {
    return $('.navbar [role="navigation"] li:nth-child(2) a').text();
}

function getCourseAttributes() {
    var d = $.Deferred();
    var p = d.promise();
    var courseinfo = {};
    var parts = getCourseName().match(/(\w{2,5})[\s\-](\w{2,4}).*?((Fa|Su|Sp)\d{2})/i);
    if(parts) {
        courseinfo.course = parts[1] + '-' + parts[2];
        courseinfo.term   = parts[3];
    } else {
        courseinfo.course = getCourseId().slice(0, 16);
        courseinfo.term = "unknown";
    }
    $.get('/user/index.php?roleid=3&id=' + getCourseId()).then(function(response) {
        var $instructor_row = $(response).find('#participants tbody tr').first();
        courseinfo.instructor = {};
        fullname = $instructor_row.find('.c2').text();
        courseinfo.instructor.firstname = fullname.split(/\s+/)[0];
        courseinfo.instructor.lastname = fullname.split(/\s+/)[1];
        courseinfo.instructor.email = $instructor_row.find('.c3').text();
        d.resolve(courseinfo);
    });
    return p;
}
