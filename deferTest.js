var http = {};
var http_info = {};
function createTester() {
    var $linkTester = $("<div/>")
        .addClass("linkTester")
        .append("<h3>Test links in a course</h3>")
        .appendTo($(".tools"));
    var $coursePicker = $("<div/>")
        .addClass("courseID")
        .append("<label>Course ID</label>")
        .append("<input type=\"number\"/>")
        .appendTo($linkTester)
        .find("input")
        .val(45605);
    var $totalLinks = $("<div/>")
        .addClass("totallinks")
        .append($("<label>Total Links:</label>"))
        .append($("<output/>"))
        .appendTo($linkTester);
    var $liveLinks = $("<div/>")
        .addClass("livelinks")
        .append($("<label>Live Links:</label>"))
        .append($("<output/>"))
        .append($("<ol/>"))
        .appendTo($linkTester);
    var $deadLinks = $("<div/>")
        .addClass("deadlinks")
        .append($("<label>Dead Links:</label>"))
        .append($("<output/>"))
        .append($("<ol/>"))
        .appendTo($linkTester);
    var $username = $("<div/>")
        .addClass("username")
        .append("<label>Optional Username:</label>")
        .append("<input type=\"text\"/>")
        .appendTo($linkTester)
        .find("input")
        .val("CDS661");
    var $password = $("<div/>")
        .addClass("password")
        .append("<label>Optional Password:</label>")
        .append("<input type=\"password\"/>")
        .appendTo($linkTester)
        .find("input")
        .val("cohort12");
    var $progress = $("<progress/>")
        .appendTo($linkTester)
        .wrap("<div/>")
        .hide();
    var $test = $("<button>Test</button>")
        .appendTo($linkTester)
        .on("click", testLinks);
}
function testLinks(courseID) {
    var courseID = $(".courseID input").val();
    if(!courseID) courseID = getCourseID();
    var _course = $.get("/course/view.php?id=" + courseID);
    _course.done(function(courseHTML) {
        $links = $(courseHTML).find(".modtype_url");
        var total = 0;
        var live = 0;
        var dead = 0;
        var tested = 0;
        var username = $(".linkTester .username input").val();
        var password = $(".linkTester .password input").val();
        $links.each(function() {
            var id = $(this).attr("id").match(/\d+/g);
            var fakeUrl = "/mod/url/view.php?id=" + id;
            var realUrl = null;
            $(".linkTester progress").attr("max", $links.length);
            $.get(fakeUrl).done(function(response) {
                var $realLink = $(response).find(".urlworkaround a");
                realUrl = $realLink.attr("href");
                $(".linkTester .totallinks output").html(total);
                var $tester = $("<script/>");
                var testersrc = "http://localhost/js/Moodle/checkLink.php?";
                testersrc += "url=" + realUrl;
                if(username && password) {
                    testersrc += "&username=" + username;
                    testersrc += "&password=" + password;
                }
                $tester.attr("src", testersrc);
                $("head")[0].appendChild($tester[0]);
                $tester.on("load", function() {
                    var info = http_info[realUrl];
                    var http_code = info["http_code"];
                    if(http_code < 400) {
                        live += 1;
                        $(".linkTester .livelinks output").html(live);
                        $(".linkTester .livelinks ol")
                            .append($("<li>").html(realUrl));
                    }
                    else {
                        if(realUrl.match(/http:\/\/www./g)) {
                        dead += 1;
                        $(".linkTester .deadlinks output").html(dead);
                        $(".linkTester .deadlinks ol")
                            .append($("<li/>").html(realUrl));
                        }
                        else $tester.src.replace(/http:\/\/./g, "http://www.");
                    }
                    tested += 1;
                    $(".linkTester progress").show().val(tested);
                })
                $tester.on("error", function(evt) {
                    console.log(evt);
                });
            });
        });
    })
}
createTester();
