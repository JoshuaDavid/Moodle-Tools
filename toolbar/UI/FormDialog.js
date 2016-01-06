// Require: Util/Date.js

function FormDialog(title, form) {
    var dialogClasses = "yui3-widget yui3-panel yui3-dd-draggable";
    dialogClasses += "yui3-widget-positioned yui3-widget-modal";
    dialogClasses += "yui3-widget-stacked moodle-dialog moodle-dialog-focused";
    var $base = $('<div class="chooserdialogue moodle-dialogue-base"/>');
    var $wrap = $('<div class="moodle-dialogue-wrap yui3-widget-stdmod ' + 
            'moodle-dialogue-content"/>');
    $base.css({
        'margin': '0 auto',
        'background': 'white'
    });
    var $dialog = $('<div class="'+dialogClasses+'"/>');
    $dialog.css({ 
        "width": "700px", 
        "height": "500px", 
        "left": window.innerWidth / 2 - 350 + "px",
        "top": window.innerHeight / 2 - 250 + "px",
        "box-shadow": "0px 0px 50px 0px gray"
    });
    var $dialog_hd = $('<div class="moodle-dialogue-hd yui3-widget-hd"/>');
    $dialog_hd.css({"cursor": "move"});
    $dialog_hd.html(title);
    $dialog_hd.on('mousedown', function(e) {
        var offX = e.offsetX;
        var offY = e.offsetY;
        function onmouseup(e) {
            $(document).off('mouseup', onmouseup);
            $(document).off('mousemove', onmousemove);
        }
        function onmousemove(e) {
            $dialog.css({
                "left": e.pageX - offX + "px",
                "top": e.pageY - offY + "px"
            });
        }
        $(document).on('mouseup', onmouseup);
        $(document).on('mousemove', onmousemove);
    });
    var $dialog_bd = $('<div class="moodle-dialogue-bd yui3-widget-bd"/>');
    $dialog_bd.css({"height": "450px", "overflow-y": "scroll"});
    $dialog_bd.html(form);
    var $dialog_ft = $('<div class="moodle-dialogue-ft yui3-widget-ft"/>');
    $close_btn = $('<button class="yui3-button closebutton" title="Close"/>');
    function close() {
        $base.remove();
    }
    $close_btn.click(close);
    $dialog_hd.append($close_btn.wrap('<span class="yui3-widget-buttons/>'));
    $base.append($wrap);
    $wrap.append($dialog);
    $dialog.append($dialog_hd).append($dialog_bd).append($dialog_ft);
    $('body').append($base);
    this.close = close;
    var d = $.Deferred();
    var p = d.promise();
    this.promise = function() {
        return p;
    }
    $dialog.find('form').submit(function(e) {
        e.preventDefault();
        e.stopPropagation();
        d.resolve($(this).serializeObject());
		//$(function(e){d.resolve($(this).serializeObject())});
        close();
    });
    return this;
}

/*
$.get('/course/modedit.php?update=1218965&return=0&sr=0').then(function(res) {
    var $form = $(res).find('form');
    $form.find('.collapsed').removeClass('collapsed');
    var title = $(res).find('div[role="main"] h2').text();
    console.log(title);
    FormDialog(title, $form);
});


function isString(s) {
    return (typeof s == "string" || s instanceof String);
}

// Create element
function crel(tag, cls) {
    var el = document.createElement(tag);
    if(cls) el.className = cls;
    return el;
}

// Style element
function stel(el, sty) {
    for(var key in sty) {
        if(sty.hasOwnProperty(key)) {
            el.style[key] = sty[key];
        }
    }
    return el;
}

function Dialog() {
    var self = this;
    var dlg = crel("div", "dialog");
    var closebtn = crel("button", "dialog-close");
    var content = crel("div", "dialog-content");
    var titlebar = crel("div", "dialog-title");
    dlg.appendChild(closebtn);
    dlg.appendChild(titlebar);
    dlg.appendChild(content);
    closebtn.innerHTML = "x";
    stel(dlg, { "position": "absolute",
        "background": "white", "border": "1px solid black", "padding": "1ex",
        "top": (0 | window.innerHeight / 2 - 100) + "px", "height": "200px",
        "left": (0 | window.innerWidth / 2 - 200) + "px", "width": "400px", 
        "box-shadow": "10px 10px 10px 10px gray"});
    stel(closebtn, { "border": "2px outset red", "background": "lightgray",
        "position": "absolute", "color": "black", "height": "20px",
        "width": "20px", "top": "0", "right": "0" });
    stel(content, { "top": "25px", });
    stel(titlebar, { "left": "0px", "font-weight": "bold"});
    closebtn.addEventListener("click", function() {
        self.close();
    });
    var showing = false;
    function showDlg() {
        if(document.body && document.body.appendChild) {
            document.body.appendChild(dlg);
            showing = true;
        } else {
            setTimeout(showDlg, 100);
        }
    }
    self.close = function() {
        if(showing) {
            document.body.removeChild(dlg);
            showing = false;
        }
    }
    self.moveTo = function(x, y) {
        stel(dlg, {"top": y + "px", "left": x + "px"});
    }
    self.setTitle = function(elem) {
        if(isString(elem)) {
            elem = document.createTextNode(elem);
        }
        titlebar.innerHTML = "";
        titlebar.appendChild(elem);
    }
    self.setContent = function(elem) {
        if(isString(elem)) {
            elem = document.createTextNode(elem);
        }
        content.innerHTML = "";
        content.appendChild(elem);
    }
    self.addContent = function(elem) {
        if(isString(elem)) {
            elem = document.createTextNode(elem);
        }
        content.appendChild(elem);
    }
    showDlg();
    self._dlg = dlg;
    return self;
}

function br() { return document.createElement('br'); }

function getCourseId() {
    var courselink = $('ul[role="navigation"] li:nth-child(2) a').attr("href");
    return courselink.match(/id=(\d+)/)[1];
}

function reduceToObject(rootobj, keyValPair) { 
    rootobj[keyValPair.name] = keyValPair.value;
    return rootobj;
}

function main() {
    var dlg = new Dialog();
    dlg.setTitle("Create Weekly Collaborate Sessions");
    dlg.setContent("");

    var $f = $("<form/>");
    dlg.addContent($f[0]);

    // Start date
    var $sdlb = $("<label for='startdate'/>");
    var $sdin = $("<input  id='startdate' type='date'/>");
    $sdlb.html("Start date:");
    $f.append($sdlb);
    $f.append($sdin);
    $f.append(br());

    // Number of Weeks
    var $nwlb = $("<label for='numweeks'/>");
    var $nwin = $("<input  id='numweeks' type='number'/>");
    $nwlb.html("Number of Weeks:");
    $f.append($nwlb);
    $f.append($nwin);
    $f.append(br());

    // Time (Hour)
    var $tmlb = $("<label for='time'/>");
    var $thin = $("<select id='time-hour'/>");
    for(var i = 0; i < 24; i++) {
        var ampm = i - 12 < 0 ? "am" : "pm";
        var t12 = i % 12;
        if(t12 == 0) t12 = 12;
        $thin.append('<option value="' + i + '">' + t12 + ':00' + ampm + '</option>');
    }
    var $tmin = $("<select  id='time-minute'/>");
    for(var i = 0; i < 60; i += 15) {
        $tmin.append('<option value="' + i + '">+' + i + ' minutes</option>');
    }
    $tmlb.html("Time of Day:");
    $f.append($tmlb);
    $f.append($thin);
    $f.append($tmin);
    $f.append(br());

    var $go = $('<button/>').html('Create Sessions');
    $go.click(function(e) {
        e.preventDefault();
        dlg.close();
        createSessions({start: $sdin[0].valueAsDate, num: $nwin.val(), time: $thin.val() + ':' + $tmin.val()});
    })
    $f.append($go);

    var id = getCourseId();
    $.get('/course/edit.php?id=' + id, function(response) {
        var $form = $(response).find('form');
        var data = $form.serializeArray().reduce(reduceToObject);
        var st_y = data['startdate[year]'];
        var st_m = data['startdate[month]'];
        var st_d = data['startdate[day]'];
        var numsections = data['numsections'];
        // This will always produce the correct date, though it can be off by an hour
        // (which doesn't actually matter since the granularity is at the day level)
        $sdin[0].valueAsDate = new Date(st_y + '-' + st_m + '-' + st_d + 'PST');
        $nwin.val(numsections);
    });
}

var days   = "Sunday Monday Tuesday Wednesday Thursday Friday Saturday".split(/ /g);
var months = "January February March April May June July August September October November December".split(/ /g);
function createSessions(params) {
    var id = getCourseId();
    var queue = [];
    function queuenext() {
        if(queue.length) {
            progressdlg.setContent(queue.length + " remaining");
            queue.shift()();
        } else {
            progressdlg.close();
            window.location.reload();
        }
    }
    var progressdlg = Dialog();
    progressdlg.setTitle("Progress");
    $.get('/course/modedit.php?add=elluminate&section=1&course=' + id, function(response) {
        var $form = $(response).find('form');
        var ds = new Date(params.start);
        for(var week = 0; week < params.num; week++) {
            var data = $form.serializeArray().reduce(reduceToObject);
            var date = new Date(new Date(ds).setUTCDate(ds.getUTCDate() + 7 * week));
            // _h means human readable
            // day of month
            var dom = date.getUTCDate();
            // day of week
            var dow = date.getUTCDay();
            var month = date.getUTCMonth();
            var dow_h = days[dow];
            var month_h = months[month];
            var year = date.getUTCFullYear();
            var date_h = dow_h + ", " + month_h + " " + dom + ", " + year;
            var hour = params.time.split(':')[0];
            var minute = params.time.split(':')[1];
            var minute_h = minute == 0 ? "00" : minute;
            var hour_h = hour == 0 ? 12 : hour < 12 ? hour : hour - 12;
            var ampm = hour < 12 ? "am" : "pm";
            var time_h = hour_h + ":" + minute_h + " " + ampm;
            data["timestart[year]"] = year;
            data["timestart[month]"] = month + 1; // Javascript uses 0 indexed months
            data["timestart[day]"] = dom;
            data["timestart[hour]"] = hour;
            data["timestart[minute]"] = minute;
            data["timeend[year]"] = year;
            data["timeend[month]"] = month + 1; // Javascript uses 0 indexed months
            data["timeend[day]"] = dom;
            data["timeend[hour]"] = (0 | hour) + 1; // 1 hour session
            data["timeend[minute]"] = minute;
            data["name"] = "Week " + (week + 1) + " Collaborate Session: " + date_h + " at " + time_h;
            data["section"] = week + 1;
            createSession(week, data);
        }
        // Do the next item in the queue
        queuenext();
    });
    function createSession(week, data) {
        queue.push(function() {
            //console.log(JSON.stringify(data, null, '\t'));
            $.post('/course/modedit.php', data, function(response) {
                console.log("DONE", data['name']);
                // Do the next item in the queue
                queuenext();
            });
        });
    }
}
*/
