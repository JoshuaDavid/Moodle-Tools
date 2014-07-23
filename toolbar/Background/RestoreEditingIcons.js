// Require: jquery.min.js
// Require: Options/main.js
function show_editing_icons() {
    $('.mod-indent-outer').each(function() { 
        var $activity = $(this);
        var $options = $activity.find('ul.menu a.menu-action');
        $options.each(function() {
            var $option = $(this);
            $option.attr("title", $option.text());
            $option.find('span').html("");
        });
        var $option_ctr = $('<div class="menu-options"/>');
        $option_ctr.append($options);
        $activity.append($option_ctr);
        $activity.find('ul.menubar').hide();
    });
}

show_editing_icons();
