const agrippaPluginClock = {
    name: "Clock",
    prompt: function (task, taskInput, plugin) {
        return new Promise(function (resolve, reject) {
            resolve({
                template: `<span>${new Date().toISOString()}</span>`
            });
        });
    },
    activate: function (task, taskInput, plugin) {
        return plugin.prompt(task, taskInput, plugin);
    },
};
