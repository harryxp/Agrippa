"use strict";

exports.copyButtonHandler = function (evt) {
    return function (button) {
        return function () {
            button = button.get(0); // get DOM element from JQuery object
            var inputField = button.nextElementSibling;
            inputField.select();
            document.execCommand("copy");
        };
    };
};

