"use strict";

exports.reinstallShortcuts = function (useFunctionKeys) {
    return function (openUrl) {
        return function (items) {
            return function () {
                $(document.body).off("keyup");
                $(document.body).on("keyup", function (evt) {
                    var baseKeyCode = useFunctionKeys ? 111 : 48;
                    if (evt.ctrlKey === true &&
                        evt.which >= baseKeyCode + 1 &&
                        evt.which <= (baseKeyCode + items.length)) {
                        var item = items[evt.which - baseKeyCode - 1];
                        jQuery.get(openUrl, {item: item});
                    }
                });
            };
        };
    };
};
