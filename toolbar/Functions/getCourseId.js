function getCourseId() {
    var $navigationel  = $('ul[role="navigation"]');
    // The navigation goes in the following order
    // 0: Home
    // 1: Current Course
    // 2+: Other stuff that varies on where you are
    var $currentcourse = $navigationel.find('li').eq(1);
    var courselink = $currentcourse.find('a').attr('href');
    var courseid = courselink.match(/id=(\d+)/)[1];
    return courseid;
}
