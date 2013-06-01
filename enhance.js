initialize();
// The queue for functions.
var queue = [];
function initialize() {
    if(typeof jQuery === "undefined") {
        includeJQuery();
        return false;
    }
    var $tools = $("<div/>").addClass("tools");
    var $content = $("<div/>").addClass("course-content");
    $(".generalbox .no-overflow").append($tools).append($content);
    test();
}
function includeJQuery() {
    var jq = document.createElement("script");
    jq.src = "http://code.jquery.com/jquery.min.js";
    var head = document.getElementsByTagName("head")[0];
    head.appendChild(jq);
    jq.addEventListener("load", initialize);
}
function getCourseID() {
    var bodyClasses = $("body").attr("class").split(/\s/g);
    for(var i = 0; i < bodyClasses.length; i++) {
        if(bodyClasses[i].match(/course/g)) {
            return bodyClasses[i].split("-")[1];
        }
    }
    throw "Course ID not found.";
}
function displayCourse(courseID) {
    var displayStatus = $.Deferred();
    $.get("/course/view.php?id=" + courseID)
    .success(function(response) {
        $(".course-content").html($(response).find(".course-content").html());
        displayStatus.resolve(true);
    })
}
function editLabel($label) {
    
}
function highlightLinkIfDead($link) {
    console.log($link);
}
function test() {
    $(document).promise()
        .then(function() {
            return include("deferTest"); 
        }).then(function() {
            console.log("hi");
        })
}
function include(scriptName) {
    var def = $.Deferred();
    var js = document.createElement("script");
    js.src="http://localhost/js/Moodle/"+scriptName + ".js";
    $(js).appendTo($("head"))
        .on("load", function() {
            console.log("Script \"" + scriptName + "\" was successfully included");
            def.resolve(true);
        }).on("error", function() {
            console.log("There was an error loading script \"" + scriptName + "\".");
            def.reject(false);
        })
    return def.promise();
}
