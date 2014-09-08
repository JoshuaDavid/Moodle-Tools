// Require: jquery.min.js

/**
 * Finds an activity in an html string..
 * Returns null if the activity is not found, or the activity if it is.
 */
function findActivityInHtml(html, section, type, title) {
    var $activity = $(html).find('#section-' + section)
    .find('.activity.' + type)
    .filter(function() {
        var $activity = $(this);
        if(type !== "label") {
            // Get rid of the "accesshide" span so the text matches
            var activity_title = $activity.find('.instancename')
                .contents()
                .filter(function() {
                    var TEXT_NODE_TYPE = 3;
                    return this.nodeType == TEXT_NODE_TYPE;
                })
                .text();
            return (title.trim() == activity_title.trim());
        } else {
            var content = $activity.find('.no-overflow .no-overflow').html();
            return (title.trim() == content.trim());
        }
    }); 
    if($activity.length) {
        // If there are multiple matches, the last one in the week is likely
        // the correct one.
        return $activity.last();
    } else {
        return null;
    }
}
