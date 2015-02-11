# Moodle-Tools

# Installation

## Server

    $ cd [webroot]/path/to
    $ git clone https://github.com/JoshuaDavid/Moodle-Tools.git

optionally

    echo [smartsheet_api_key] > path/to/Moodle-Tools

## Client
These instructions will vary slightly by browser.

### Firefox
1. Download [GreaseMonkey](https://addons.mozilla.org/en-Us/firefox/addon/greasemonkey/)
2. Visit http://[server]/path/to/Moodle-Tools/userscripts/Toolbar.user.js
3. Click `Install`

### Chrome / Chromium
1. Download [TamperMonkey for Chrome](http://tampermonkey.net/?browser=chrome)
2. Visit http://[server]/path/to/Moodle-Tools/userscripts/Toolbar.user.js
3. Click `Install`

### Safari
1. Download [TamperMonkey for Safari](http://tampermonkey.net/?browser=safari)
2. Visit http://[server]/path/to/Moodle-Tools/userscripts/Toolbar.user.js
3. Click `Install`

### Opera
1. Download [TamperMonkey for Opera](http://tampermonkey.net/?browser=opera)
2. Visit http://[server]/path/to/Moodle-Tools/userscripts/Toolbar.user.js
3. Click `Install`

### Internet Explorer
If you know of a way to do this, please file a pull request.

# Toolbar

The toolbar adds buttons to perform several common and repetitive tasks in Moodle

## Add Weekly Collaborate
Begins walking the editing user through a process that will create a number of Collaborate sessions, one per week,
with the same settings for each session. Additionally, allows the user to add or remove moderators to all sessions
at the same time. This feature was implemented because duplicating or importing a Collaborate session does not create
a new Collaborate session on Blackboard's server, so the sessions had to be created manually.

## Edit Labels
Allows the editing user to make changes to the text of a label by simply clicking on that text and typing. Changes 
are saved when the user stops editing the label and clicks somewhere else.

## Replace Legacy Forums with New Forums
Moodle recently started transitioning from its old style of forums to a new style (hsu forums) which allows the use
of several additional features and is also accessible. As the HSU forums are not the same type as the legacy forums,
this means there would be a lot of repetitive work to transition them manually.

This function finds all legacy forums on the page (except Announcements / News Forum) and for each one, creates a 
new HSU forum with the same settings. It then moves the HSU forum to the same place on the page as the legacy forum
was, and hides the legacy forum.

**Note that this function does not copy over posts in the forum**

## Put Collaborate on Smartsheet
If you have an API key in `path/to/Moodle-Tools/.smartsheet_api_key.txt`, this allows you to make a spreadsheet
in SmartSheet which contains the schedule of Collaborate sessions for that course, as well as instructor and
course name.

## Clear All Gradebook Category Overrides
Due to (probably) a synchronization problem between the database server and the Moodle server, sometimes categories
in the gradebook are marked as being overridden, which prevents new grades on assignments from affecting the category
totals or overall grade.

This function clears ALL overrides in the gradebook. 

## Collapse / Expand Sections
Hides / shows all activities within all sections. Useful when moving sections around in the course, as it reduces 
the need to scroll excessively.
