// Require: jquery.min.js
// Require: Functions/getUserId.js
// Require: Functions/getCourseId.js
// Require: UI/TopMenu.js
// Require: UI/FunctionButton.js

function makecallback(fn) {
    var name = "callback_";
    for(var i = 0; i < 16; i++) {
        name += String.fromCharCode(97 + Math.random() * 26);
    }
    window[name] = fn;
    return name;
}

RevisionHistory = {};

RevisionHistory.save = function(module, data, action) {
    if(!action) var action = "save";
    var xss = document.createElement("script");
    var src = SERVER + "/js/Moodle/revisions/add_revision.php?";
    uricomponents = [];
    uricomponents.push("course_id=" + getCourseId());
    uricomponents.push("user_id=" + getUserId());
    uricomponents.push("module_id=" + module);
    uricomponents.push("action_name=" + action);
    uricomponents.push("data=" + encodeURI(JSON.stringify(data)));
    src += uricomponents.join("&");
    var d = $.Deferred();
    var p = d.promise();
    var callback = makecallback(function(res) {
        d.resolve(res);
        delete window[callback];
    });
    src += "&callback=" + callback;
    xss.src = src;
    document.head.appendChild(xss);
    return p;
}

RevisionHistory.search = function(search_params) {
    var src = SERVER + "/js/Moodle/revisions/show_revisions.php?";
    var xss = document.createElement("script");
    uricomponents = [];
    if(search_params) {
        if(search_params.module_id !== undefined) {
            uricomponents.push("module_id=" + search_params.module_id);
        }
        if(search_params.course_id !== undefined) {
            uricomponents.push("course_id=" + search_params.course_id);
        }
        if(search_params.user_id !== undefined) {
            uricomponents.push("user_id=" + search_params.user_id);
        }
        if(search_params.action !== undefined) {
            uricomponents.push("action=" + search_params.action);
        }
        src += uricomponents.join("&");
    }
    var d = $.Deferred();
    var p = d.promise();
    var callback = makecallback(function(res) {
        data = res.map(function(module) {
            module.data = JSON.parse(module.data);
            return module;
        });
        d.resolve(data);
        delete window[callback];
    });
    src += "&callback=" + callback;
    xss.src = src;
    document.head.appendChild(xss);
    return p;
}

function saveModule(module, action) {
    if(action === undefined) var action = "save";
    return $.get('/course/modedit.php?update=' + module).then(function(response) {
        var data = $(response).find('form').serializeObject();
        // Prevent Session Hijacking
        delete data.sesskey;
        return RevisionHistory.save(module, data, action);
    });
}

function deleteModule(module) {
    $("#module-" + module).remove();
    return saveModule(module, "delete").then(function() {
        var data = {
            "delete": module,
            "sr": 0,
            "confirm": 1,
            "sesskey": getSesskey()
        };
        return $.post("/course/mod.php", data);
    });
}

$("a.editing_delete").click(function(e) {
    e.preventDefault();
    e.stopPropagation();
    console.log(this);
    var module = this.href.match(/delete=(\d+)/)[1];
    deleteModule(module);
});

function restoreDeletedModule(module) {
    console.log("Restoring Module", module);
    return RevisionHistory.search({
        "module_id": module,
        "course_id": getCourseId(),
        "action": "delete"
    }).then(function(modules) {
        var module = modules.filter(function(module) {
            return module.data.modulename;
        })[0];
        console.log(module)
        var data = module.data;
        data.sesskey = getSesskey();
        data.coursemodule = "";
        data.update = "";
        data.add = data.modulename;
        return $.post("/course/modedit.php", data).then(function() {
            // Todo: Make this smoother
            // window.location.reload();
        });
    });
}

function interactiveRestoreModules() {
    var title = "Restore Deleted Modules";
    return RevisionHistory.search({
        "course_id": getCourseId(),
        "action": "delete"
    }).then(function(modules) {
        var d = $.Deferred();
        var p = d.promise();
        var $form = $("<form>");
        var modules_to_restore = [];
        modules.forEach(function(module) {
            var $box = $('<input type="checkbox" />');
            var module_id = module.module_id;
            $box.attr("id", "restore-" + module_id);
            $box.attr("name", "restore-" + module_id);
            var $label = $('<label>');
            $label.attr("for", "restore-" + module_id);
            if(module.data.modulename == "label") {
                $label.html(module.data["introeditor[text]"]);
            } else {
                $label.html(module.data["name"]);
            }
            $label.append('<span>Saved: ' + module.date + '</span>');
            $line = $('<div>');
            $line.append($box);
            $box.click(function() {
                if(modules_to_restore[module_id]) {
                    modules_to_restore[module_id] = 0;
                } else {
                    modules_to_restore[module_id] = 1;
                }
            });
            $line.append($label);
            $form.append($line);
        });
        $submit = $('<button>').html("Restore");
        $form.append($submit);
        var fd = new FormDialog(title, $form);
        $submit.click(function(e) {
            e.preventDefault();
            e.stopPropagation();
            for(var module in modules_to_restore) {
                if(modules_to_restore[module]) {
                    restoreDeletedModule(module);
                }
            }
            fd.close();
            d.resolve("restoring");
        });
        return p;
    });
}

var title = "Restore Deleted Modules";
var action = interactiveRestoreModules;
var visFn = isEditingHomepage;
var options = { };

var btn = new FunctionButton(title, action, visFn, options);
/*
TM.add(btn);
function restoreAsNewModule(module) {
    RevisionHistory.search({
        "module_id": module,
        "course_id": getCourseId()
    }).then(function(modules) {
        var d = $.Deferred();
        var p = d.promise();
        modules.sort(function(mod_a, mod_b) {
            var time_a = new Date(mod_a.date).getTime();
            var time_b = new Date(mod_b.date).getTime();
            return time_b - time_a;
        });
        var latest_revision = modules[0];
    });

}
*/
