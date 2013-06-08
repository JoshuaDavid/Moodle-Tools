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
                deferred.resolve(info);
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
        if(urlIsSameOrigin(url)) {
            var settings = {
                "type": "head"
            };
            var head = $.ajax(url, settings);
            head.done(resolveFromJSHeadRequest).fail(reject);
        }
        else {
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
            setTimeout(resolveFromJSONPHeadRequest, 5000);
        }
    }
    function resolveFromJSONPHeadRequest() {
        var info = http_info[url];
        if(http_info[url]) deferred.resolve(info);
        else deferred.reject().error(reject);
    }
    function resolveFromJSHeadRequest(responseText, dunno, responseObject) {
        var headerObjStr = responseObject.getAllResponseHeaders().trim();
        headerObjStr = headerObjStr.replace(/: /g, '": "');
        headerObjStr = headerObjStr.replace(/\n/g, '",\n"');
        headerObjStr = headerObjStr.replace(/\s+/g, ' ');
        headerObjStr = '{"' + headerObjStr + '"}';
        var headerObj = JSON.parse(headerObjStr);
        http_info[url] = url;
    }
    function reject() {
        deferred.reject();
    }
    $.when(url, username, password).then(resolve).fail(reject);
    return promise;
}
function getUsername() {
    var $usernameInput = $(".linkTester .username input");
    var username = $usernameInput.val();
    return username;
}
function getPassword() {
    var $passwordInput = $(".linkTester .password input");
    var password = $passwordInput.val();
    return password;
}
function getRealUrl(moodleUrl) {
    // moodleUrl is the url Moodle assigns to all links for tracking and
    // such.
    var deferred = new $.Deferred();
    var promise = deferred.promise();
    function resolve(moodleUrl) {
        if(moodleUrl.match(window.location.origin + '/mod/url/')){
            $.get(moodleUrl).then(getRealUrlFromPageAndResolve);
        }
        else {
            deferred.resolve(moodleUrl);
        }
    }
    function getRealUrlFromPageAndResolve(page) {
        var realUrl = $(page).find(".urlworkaround").attr("href");
        deferred.resolve(realUrl);
    }
    function reject() {
        deferred.reject();
    }
    $.when(moodleUrl).then(resolve).fail(reject);
    return promise;
}
function urlIsSameOrigin(url) {
    return url.match(window.location.origin);
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
