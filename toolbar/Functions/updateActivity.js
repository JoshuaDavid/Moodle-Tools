// Require: jquery.min.js

// Update an activity, specified by an id
//  For each key specified, if it is not a function, set that key to the value
//      supplied. If it is a function, that function should be in the form of
//      
//      function(value, [old_settings]) {
//          ...
//          return new_value
//      }

function updateActivity(id, settings) {
    var section;

    $.get('/course/modedit.php?update=' + id).then(function(response) {
        var $form = $(response).find('form');
        var old_settings = $form.serializeObject();
        var new_settings = $form.serializeObject();
        for(var key in settings) {
            if(settings.hasOwnProperty(key)) {
                if(typeof settings[key] == "function") {
                    var fn = settings[key];
                    var new_value = fn(old_settings[key], old_settings);
                    new_settings[key] = new_value;
                } else {
                    new_settings[key] = settings[key];
                }
            }
        }
        section = new_settings['section'];

        return $.post('/course/modedit.php', new_settings);
    }).then(function(response) {
        // The response is going to be the Moodle homepage, so look there
        // to make sure that everything worked correctly.

        var $activity = $(response).find('#section-' + section + 'module-' + id);
    });
}

// function confirm() { return true; }
