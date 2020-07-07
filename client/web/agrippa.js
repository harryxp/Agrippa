"use strict";

///////////////////////
// Plugins and Tasks //
///////////////////////

const agrippa = {
    tasks: {
        g: {
            name: "Google Search",
            plugin: "OnlineSearch",
            url: "https://www.google.com/search?q=%s"
        },
        c: {
            name: "Clock",
            plugin: "Clock",
        },
        "?": {
            name: "Task Search",
            plugin: "TaskSearch",

        },
        "k": {
            name: "KeePass",
            plugin: "KeePass1",
        }
    },
    defaultTask: {
        name: "Google Search (default)",
        plugin: "OnlineSearch",
        url: "https://www.google.com/search?q=%s"
    },
    plugins: {
        OnlineSearch: {
            name: "OnlineSearch",
            prompt: function (task, taskInput) {
                const targetUrl = sprintf(task.url, encodeURIComponent(taskInput));
                return {
                    template: `<span>Keep typing the query. Press &lt;Enter&gt; to visit ${targetUrl}.</span>`
                };
            },
            activate: function (task, taskInput) {
                const targetUrl = sprintf(task.url, encodeURIComponent(taskInput));
                window.location.href = targetUrl;
                return {};
            },
        },
        Clock: {
            name: "Clock",
            prompt: function (task, taskInput) {
                return {
                    template: `<span>${new Date().toISOString()}</span>`
                };
            },
            activate: function (task, taskInput) {
                return {};
            },
        },
        TaskSearch: {
            name: "TaskSearch",
            prompt: function (task, taskInput) {
                return {
                    computed: {
                        matchedTasks: function () {
                            const matchedTasks = {};
                            for (const taskKey in agrippa.tasks) {
                                const taskName = agrippa.tasks[taskKey].name;
                                const idx = taskName.toLowerCase().indexOf(taskInput.toLowerCase());
                                if (idx !== -1) {
                                    matchedTasks[taskKey] = {
                                        prefix: taskName.slice(0, idx),
                                        matched: taskName.slice(idx, idx + taskInput.length),
                                        suffix: taskName.slice(idx + taskInput.length),
                                    };
                                }
                            }
                            return matchedTasks;
                        }
                    },
                    template: `
                        <div>
                            <span>Press &lt;Enter&gt; to select first task.</span>
                            <table>
                                <tr><th>Keyword</th><th>Task</th></tr>
                                <tr v-for="(taskName, taskKey) in matchedTasks">
                                    <td>{{ taskKey }}</td>
                                    <td>{{ taskName.prefix }}<span class="agrippa-highlighted-text">{{ taskName.matched }}</span>{{ taskName.suffix }}</td>
                                </tr>
                            </table>
                        </div>
                    `
                };
            },
            activate: function (task, taskInput) {
                const matchedTasks = this.prompt(task, taskInput).computed.matchedTasks();
                const component = {};
                if (matchedTasks) {
                    component["inputText"] = Object.keys(matchedTasks)[0] + " ";
                }
                return component;
            },
        },
        KeePass1: {
            name: "KeePass1",
            prompt: function (task, taskInput) {
                return {
                    template: `<span></span>`
                };
            },
            activate: function (task, taskInput) {
                axios.get('http://localhost:3000/agrippa/config')
                    .then(function (response) {
                        // handle success
                        console.log(response);
                    })
                    .catch(function (error) {
                        // handle error
                        console.log(error);
                    })
                    .finally(function () {
                        // always executed
                    });
                return {
                };
            }
        }
    }
};

///////////////
// Vue Stuff //
///////////////

new Vue({
    el: "#agrippa-vue",
    data: {
        isHelpVisible: false,
        inputText: "",
        tasks: agrippa.tasks
    },
    computed: {
        helpButtonText: function () {
            return this.isHelpVisible ? "Got it!" : "What do I do?";
        },
        inputSpaceIndex: function () {
            return this.inputText.trimStart().indexOf(" ");
        },
        taskKey: function () {
            if (this.inputSpaceIndex === -1) {
                return "";
            } else {
                return this.inputText.slice(0, this.inputSpaceIndex);
            }
        },
        taskInput: function () {
            if (this.currentTask === agrippa.defaultTask) {
                return this.inputText;
            } else {
                if (this.inputSpaceIndex === -1) {
                    return "";
                } else {
                    return this.inputText.slice(this.inputSpaceIndex + 1);
                }
            }
        },
        currentTask: function () {
            if (this.taskKey in agrippa.tasks) {
                return agrippa.tasks[this.taskKey];
            } else {
                return agrippa.defaultTask;
            }
        },
        currentPlugin: function () {
            // TODO what if plugin can't be found - maybe display an error in output below
            // or validate tasks when loading them (think I prefer this one)
            return agrippa.plugins[this.currentTask.plugin];
        },
        output: function () {
            if (this.currentPlugin) {
                return this.currentPlugin.prompt(this.currentTask, this.taskInput);
            } else {
                return {
                    template: "<span></span>"
                };
            }
        }
    },
    methods: {
        activateTask: function (event) {
            if (this.currentPlugin) {
                const stateDelta = this.currentPlugin.activate(this.currentTask, this.taskInput);
                for (const key in stateDelta) {
                    this[key] = stateDelta[key];
                }
            }
        }
    }
});
