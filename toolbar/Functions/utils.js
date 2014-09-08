// A collection of utility functions

function is(x) {
    return function(y) {
        return x == y;
    }
}

function matches(regexp) {
    return function(str) {
        regexp.test(str);
    }
}
