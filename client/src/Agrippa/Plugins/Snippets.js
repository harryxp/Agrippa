"use strict";

exports.shortcutHandler = function (evt) {
    return function (body) {
        return function () {
            var baseKeyCode = 48;   // key code for 0
            var n = evt.which - baseKeyCode + 1;
            var button = $("#agrippa-output > table > tr:nth-child(" + n + ") > td > button")[0];
            if (button) {
                button.click();
            }
        };
    };
};

exports.copyButtonHandler = function (evt) {
    return function (button) {
        return function () {
            // button is a JQuery object
            // parent() returns DOM elements, hence td is a DOM element
            var td = button.parent()[0];
            var inputField = td.previousElementSibling.children[0];
            inputField.select();
            document.execCommand("copy");
        };
    };
};

exports.clickFirstCopyButton = function () {
    var button = $("#agrippa-output > table > tr:first > td > button")[0];
    if (button) {
        button.click();
    }
}
