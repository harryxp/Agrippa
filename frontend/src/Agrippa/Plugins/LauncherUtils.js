"use strict";

exports.reinstallShortcuts = function (launchUrl) {
    return function (appNames) {
        return function () {
            $(document.body).off("keyup");
            $(document.body).on("keyup", function (evt) {
                if (evt.ctrlKey === true &&
                    evt.which >= 49 &&
                    evt.which <= (48 + appNames.length)) {
                    var appName = appNames[evt.which - 49];
                    jQuery.post(launchUrl, {app: appName});
                }
            });
        };
    };
};
