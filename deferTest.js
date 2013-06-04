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
                var linkState = getLinkState(realUrl);
                $.when(linkState).then(function(state) {
                    if(state) {
                        var $link = $("<a/>");
                        $link.attr("href", state["url"]);
                        $link.html(state["url"]);
                        $link.wrap("<li/>");
                        $(".linkTester .livelinks").append($link.parent());
                    }
                    else {
                        var $link = $("<a/>");
                        $link.attr("href", state["url"]);
                        $link.html(state["url"]);
                        $link.wrap("<li/>");
                        $(".linkTester .deadlinks").append($link.parent());
                    }
                });
            });
        });
    })
}
createTester();
function getLinkState(url) {
    var deferred = new $.Deferred();
    var promise = deferred.promise();
    function resolve(info) {
        if(info["http_code"] && info["http_code"] < 400) {
            deferred.resolve(info);
        }
        else {
            if(url != info["url"]) {
                // A redirect has occurred
                console.log("redirect: ", url, "=>", info["url"]);
                deferred.notify({
                    "type": "redirect",
                    "old_location": url,
                    "new_location": info["url"]
                });
                url = info["url"];
                test();
            }
            else {
                info.valueOf = function() {
                    // Means that if(info) else will cause the else
                    // block to be executed.
                    return false;
                }
                deferred.resolve(false);
            }
        }
    }
    function reject() {
        deferred.reject();
    }
    function test() {
        $.when(headRequest(url)).then(resolve).fail(reject);
    }
    test();
    return promise;
}
function headRequest(url) {
    var deferred = new $.Deferred();
    var promise = deferred.promise();
    var username = getUsername();
    var password = getPassword();
    function resolve(url, username, password) {
        var $tester = $("<script/>");
        var src = "http://localhost/js/Moodle/checkLink.php?";
        src += "url=" + encodeURIComponent(url);
        if(username && password) {
            src += "&username=" + encodeURIComponent(username);
            src += "&password=" + encodeURIComponent(password);
        }
        $tester.attr("src", src);
        $("head").append($tester);
        // Set a time limit of 5 seconds on the loading of the script.
        setTimeout(resolveIfComplete, 5000);
    }
    function resolveIfComplete() {
        var info = http_info[url];
        if(http_info[url]) deferred.resolve(info);
        else deferred.reject();
    }
    function reject() {
        deferred.reject();
    }
    $.when(url, username, password).then(resolve).fail(reject);
    return promise;
}
function getUsername() {
    var deferred = new $.Deferred();
    var promise = deferred.promise();
    function resolve() {
        var $usernameInput = $(".linkTester .username input");
        var username = $usernameInput.val();
        deferred.resolve(username);
    }
    function reject() {
        deferred.reject();
    }
    $.when(arguments).then(resolve).fail(reject);
    return promise;
}
function getPassword() {
    var deferred = new $.Deferred();
    var promise = deferred.promise();
    function resolve() {
        var $passwordInput = $(".linkTester .password input");
        var password = $passwordInput.val();
        deferred.resolve(password);
    }
    function reject() {
        deferred.reject();
    }
    $.when(arguments).then(resolve).fail(reject);
    return promise;
}
function promisePrototype() {
    var deferred = new $.Deferred();
    var promise = deferred.promise();
    function resolve() {
        deferred.resolve();
    }
    function reject() {
        deferred.reject();
    }
    $.when(arguments).then(resolve).fail(reject);
    return promise;
}
