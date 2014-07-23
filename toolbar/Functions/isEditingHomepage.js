// Require: jquery.min.js

function isEditingHomepage() {
    var $editoffbutton = $('input[name="edit"][value="off"]');
    return ($editoffbutton.size() > 0);
}
