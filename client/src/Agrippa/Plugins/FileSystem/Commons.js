"use strict";

exports.installShortcutHandler = function (openUrl) {
    return function (index) {
        return function (item) {
            return function () {
                $(document.body).on("keyup", function (evt) {
                    var baseKeyCode = 48;
                    // ctrlKey and shiftKey are the reason why we have to use JavaScript
                    // PureScript jQuery library can't access them
                    if (evt.ctrlKey === true &&
                        evt.shiftKey === true &&
                        evt.which === baseKeyCode + index) {
                        jQuery.get(openUrl, {item: item});
                    }
                });
            };
        };
    };
};

