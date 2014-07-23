// Require: jquery.min.js

Options = new (function Options() {return this})();
Options.set = function(name, value) {
    localStorage.setItem("toolbar-" + name, JSON.stringify(value));
}

Options.get = function(name) {
    return JSON.parse(localStorage.getItem("toolbar-" + name));
}

Options.asObject = function() {
    var o = {};
    for(var key in localStorage) {
        if(localStorage.hasOwnProperty(key)) {
            o[key] = JSON.parse(localStorage[key]);
        }
    }
}
