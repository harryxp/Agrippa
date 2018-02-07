"use strict";

exports.shortcutHandler = function (openUrl) {
    return function (evt) {
        return function (body) {
            return function () {
                // ctrlKey and shiftKey are the reason why we have to use JavaScript
                // PureScript jQuery library can't access them
                if (evt.ctrlKey === true && evt.shiftKey === true) {
                    var baseKeyCode = 48;   // key code for 0
                    var n = evt.which - baseKeyCode + 1;
                    if (n >= 2 && n <= 10) {
                        var link = $("#agrippa-output > div > div:nth-child(" + n + ") > a")[0];
                        if (link) {
                            jQuery.get(openUrl, {item: link.text});
                        }
                    }
                }
            };
        };
    };
};

