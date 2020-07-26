"use strict";

const agrippaPluginClock = {
    name: "Clock",
    prompt: function (task, taskInput) {
        return new Promise(function (resolve, reject) {
            resolve({
                template: `<span>${new Date().toISOString()}</span>`
            });
        });
    },
    activate: function (task, taskInput) {
        return agrippaPluginClock.prompt(task, taskInput);
    },
};
