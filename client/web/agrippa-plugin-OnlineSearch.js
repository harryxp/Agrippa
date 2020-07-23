const agrippaPluginOnlineSearch = {
    name: "OnlineSearch",
    prompt: function (task, taskInput, plugin) {
        return new Promise(function (resolve, reject) {
            const targetUrl = sprintf(task.url, encodeURIComponent(taskInput));
            resolve({
                template: `<span>Keep typing the query. Press &lt;Enter&gt; to visit ${targetUrl}.</span>`
            });
        });
    },
    activate: function (task, taskInput, plugin) {
        return new Promise(function (resolve, reject) {
            const targetUrl = sprintf(task.url, encodeURIComponent(taskInput));
            window.location.href = targetUrl;
            resolve({
                template: `<span>Visiting ${targetUrl}...</span>`
            });
        });
    },
};
