"use strict";

exports.copyButtonHandler = function (evt) {
    return function (button) {
        return function () {
            // button is a JQuery object
            // parent() returns DOM elements, hence td is a DOM element
            var td = button.parent()[0];
            var inputField = td.nextElementSibling.children[0];
            inputField.select();
            document.execCommand("copy");
        };
    };
};

