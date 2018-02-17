"use strict";

exports.copyButtonListener = function (evt) {
    return function (button) {
        return function () {
            // button is a JQuery object
            button.prev().select()
            document.execCommand("copy");
        };
    };
};

