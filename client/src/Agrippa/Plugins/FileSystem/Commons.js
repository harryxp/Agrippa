"use strict";

exports.reinstallShortcuts = function (useFunctionKeys) {
    return function (launchUrl) {
        return function (appNames) {
            return function () {
                $(document.body).off("keyup");
                $(document.body).on("keyup", function (evt) {
                    var baseKeyCode = useFunctionKeys ? 111 : 48;
                    if (evt.ctrlKey === true &&
                        evt.which >= baseKeyCode + 1 &&
                        evt.which <= (baseKeyCode + appNames.length)) {
                        var appName = appNames[evt.which - baseKeyCode - 1];
                        jQuery.post(launchUrl, {app: appName});
                    }
                });
            };
        };
    };
};
