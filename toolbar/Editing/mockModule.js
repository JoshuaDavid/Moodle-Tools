// Require: jquery.min.js
/*
<li class="activity forum modtype_forum  yui3-dd-drop yui3-dd-draggable" id="module-1482921">
    <div>
        <span class="editing_move moodle-core-dragdrop-draghandle" title="Move resource" tabindex="0" data-draggroups="resource" role="button">
            <img src="/theme/image.php/express/core/1405647275/i/dragdrop|_2|_2659_54672_35684_2239122_v1389942068" alt="Move resource" class="iconsmall" style="cursor: move;">
        </span>
        <div class="mod-indent-outer">
            <div class="mod-indent">
            </div>
            <div>
                <div class="activityinstance" id="yui_3_13_0_2_1406757341238_1660">
                    <a href="/mod/forum/view.php?id=1482921" id="yui_3_13_0_2_1406757341238_1659">
                        <img src="/theme/image.php/express/forum/1405647275/icon" class="iconlarge activityicon" alt=" " role="presentation">
                        <span class="instancename">News forum<span class="accesshide "> Forum (legacy)</span>
                        </span>
                        </a> <span>
                        <a class="editing_title" data-action="edittitle" title="Edit title" href="https://moodle.csun.edu/course/mod.php?sesskey=lQbCzdOM99&amp;sr=0&amp;update=1482921">
                            <img class="iconsmall visibleifjs" alt="" src="/express/design/2/1405647280/pix_core/t/editstring.svg">
                        </a>
                    </span>
                </div>
            </div>
            <div class="menu-options">
            </div>
        </div>
    </div>
</li>
*/

// Because Moodle doesn't have a static location for images

var rev = $('img').attr('src').match(/\d{10}/)[0];

function mockEditingIcon(settings) {
    var action = settings.action;
    var actionTitle = settings.title || action;
    var iconsrc = settings.iconsrc;
    var id = settings.id;
    var href = settings.href;
    var $link = $('<a>'); // </a>
    var $icon = $('<img/>');
    $link.append($icon);
    $link.addClass("editing_" + action);
    $link.addClass("menu-action");
    $link.addClass("cm-edit-action");
    $link.attr("data-action", action);
    $link.attr("role", "menuitem");
    $link.attr("href", href);
    $icon.attr("src", iconsrc);
    $icon.addClass("iconsmall");
    $icon.attr("alt", title);
    $icon.attr("title", title);
    return $link;
} 

function mockModule(module) {
    var id = module.coursemodule;
    var $module = $('<li/>');
    $module.attr("id", "module-" + id);
    var $wrap = $('<div class="mod-indent-outer"/>');
    var base = '/course/mod.php?sr=0&sesskey=' + getSesskey();
    var icon_base = "/express/design/2/" + rev + "/pix_core/t";
    var iconsettings = {
        editing_update: {
            action: "update",
            title: "Edit Settings",
            iconsrc: icon_base + "/edit.svg",
            href: base + "&sr=0&update=" + id
        },
        editing_moveright: {
            action: "moveright",
            title: "Move Right",
            iconsrc: icon_base + "/right.svg",
            href: base + "&indent=1&id=" + id
        },
        editing_moveleft: {
            action: "moveleft",
            title: "Move Left",
            iconsrc: icon_base + "/left.svg",
            href: base + "indent=-1&id=" + id
        },
        editing_hide: {
            action: "hide",
            title: "Hide",
            iconsrc: icon_base + "/hide.svg",
            href: base + "&hide=" + id
        },
        editing_show: {
            action: "show",
            title: "Show",
            iconsrc: icon_base + "/show.svg",
            href: base + "&show=" + id
        },
        editing_duplicate: {
            action: "duplicate",
            title: "duplicate",
            iconsrc: icon_base + "/copy.svg",
            href: base + "&duplicate=" + id
        },
        editing_delete: {
            action: "delete",
            title: "Delete",
            iconsrc: icon_base + "/delete.svg",
            href: base + "&delete=" + id
        },
    };
    var icons = {}
    var $menu = $('<div class="menu-options"/>');
    for(var name in iconsettings) {
        var $icon = mockEditingIcon(iconsettings[name]);
        icons[name] = $icon;
        $menu.append($icon);
    }
    $(icons.editing_show).click(function(e) {
        e.preventDefault();
        console.log("Showing....");
        $(icons.editing_show).hide()
        $(icons.editing_hide).show()
        $.get(base + "&show=" + id);
    });
    $(icons.editing_hide).click(function(e) {
        e.preventDefault();
        console.log("Hiding....");
        console.log(icons.editing_hide[0]);
        console.log(icons.editing_show[0]);
        $(icons.editing_hide).hide()
        $(icons.editing_show).show()
        $.get(base + "&hide=" + id);
    });
    if(module.visible) {
        $(icons.editing_show).hide()
        $(icons.editing_hide).show()
    } else {
        $(icons.editing_hide).hide()
        $(icons.editing_show).show()
    }
    // For some reason, I can't see the editing_hide and editing_show icons
    var $innerWrap = $('<div class="activityinstance"/>');
    var $viewlink = $('<a/>');
    $viewlink.attr("href", "/mod/" +  module.modulename + "/view.php?id=" + id);
    var $activityicon = $('<img/>');
    $activityicon.attr("src", "/theme/image.php/express/forum/1405647275/icon");
    var $title = $('<span class="instancename"/>');
    $title.html(module.name);
    $viewlink.append($activityicon);
    $viewlink.append($title);
    $innerWrap.append($viewlink);
    $innerWrap.append($menu);
    $wrap.append($innerWrap);
    $module.append($wrap);
    return $module;
}
