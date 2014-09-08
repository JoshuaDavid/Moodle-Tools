// Require: jquery.min.js

function getUserId() {
    return $('.usersname a').attr('href').match(/id=(\d+)/)[1];
}
