// Require: jquery.min.js
// Require: UI/TopMenu.js

var title = "Clear All Gradebook Category Overrides";
var action = clearAllGradebookCategoryOverrides;
var options = {
    disableOnClick: false,
}
var weeklyCollabBtn = new FunctionButton(title, action, visFn, options);
TM.add(weeklyCollabBtn);

function clearAllGradebookCategoryOverrides() {
    $('.grade.cat.overridden').each(function() {
        var cell = this;
        var href = $(this).find('a.action-icon').attr('href');
        $.get(href).then(function(response) {
            var $form = $(response).find('form');
            data = $form.serializeObject();
            data.overridden = "0";
            data.submitbutton = "Save changes";
            $.post($form.attr("action"), data).then(function() {
                cell.classList.remove('overridden');
                $(cell).find('input').val('');
            });
        });
    });
}
