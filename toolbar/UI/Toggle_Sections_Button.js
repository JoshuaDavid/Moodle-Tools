// Require: ./jquery.min.js
// Require: ./UI/FunctionButton.js
// Require: ./UI/ToggleButton.js
// Require: ./UI/TopMenu.js

if(window.location.pathname.match(/\/course\/view\.php/)) {
    var csb = new FunctionButton("Collapse Sections", collapse_sections);
    var esb = new FunctionButton("Expand Sections", expand_sections);
    var toggle_sections = new ToggleButton(csb, esb);
    TM.add(toggle_sections);
}

function collapse_sections() {
    $('.section.main .content .section').hide();
    $('.section.main .content .summary').hide();
}
function expand_sections() {
    $('.section.main .content .section').show();
    $('.section.main .content .summary').show();
}
