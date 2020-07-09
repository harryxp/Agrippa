"use strict";

///////////////////////
// Plugins and Tasks //
///////////////////////

// holds defaultTask, tasks, and plugins
const agrippa = {
    tasks: {},
    defaultTask: {},
    plugins: {
        // OnlineSearch: {
        //     name: "OnlineSearch",
        //     prompt: function (task, taskInput) {
        //         const targetUrl = sprintf(task.url, encodeURIComponent(taskInput));
        //         return {
        //             template: `<span>Keep typing the query. Press &lt;Enter&gt; to visit ${targetUrl}.</span>`
        //         };
        //     },
        //     activate: function (task, taskInput) {
        //         const targetUrl = sprintf(task.url, encodeURIComponent(taskInput));
        //         window.location.href = targetUrl;
        //         return {};
        //     },
        // },
        Clock: {
            name: "Clock",
            prompt: function (task, taskInput) {
                return new Promise(function (resolve, reject) {
                    resolve({
                        template: `<span>${new Date().toISOString()}</span>`
                    });
                });
            },
            activate: function (task, taskInput) {
                return this.prompt(task, taskInput);
            },
        },
        TaskSearch: {
            name: "TaskSearch",
            prompt: function (task, taskInput) {
                return new Promise(function (resolve, reject) {
                    resolve({
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
                                <table>
                                    <tr><th>Keyword</th><th>Task</th></tr>
                                    <tr v-for="(taskName, taskKey) in matchedTasks">
                                        <td>{{ taskKey }}</td>
                                        <td>{{ taskName.prefix }}<span class="agrippa-highlighted-text">{{ taskName.matched }}</span>{{ taskName.suffix }}</td>
                                    </tr>
                                </table>
                            </div>
                        `
                    });
                });
            },
            activate: function (task, taskInput) {
                return this.prompt(task, taskInput);
            },
        },
        // KeePass1: {
        //     name: "KeePass1",
        //     prompt: function (task, taskInput) {
        //         return {
        //             template: `<span></span>`
        //         };
        //     },
        //     activate: async function (task, taskInput) {
        //         axios.get("/agrippa/config")
        //             .then(function (response) {
        //                 // handle success
        //                 console.log(response);
        //             })
        //             .catch(function (error) {
        //                 // handle error
        //                 console.log(error);
        //             })
        //             .finally(function () {
        //                 // always executed
        //             });
        //         return {
        //         };
        //     }
        // }
    }
};

// load Agrippa config
(async function () {
    axios.get("/agrippa/config")
        .then(function (response) {
            if ("tasks" in response.data && "defaultTask" in response.data) {
                agrippa.tasks = response.data.tasks;
                agrippa.defaultTask = response.data.defaultTask;
            } else {
                const errorMsg = "Config file is missing 'tasks' or 'defaultTask'. Please rectify.";
                console.error(errorMsg);
                alert(errorMsg);
            }
        })
        .catch(function (error) {
            const errorMsg = "Failed to load Agrippa config from /agrippa/config. Please check your config file.";
            console.error(errorMsg);
            alert(errorMsg);
        });
})();

///////////////
// Vue Stuff //
///////////////

new Vue({
    el: "#agrippa-vue",
    data: {
        isHelpVisible: false,
        inputText: "",
        output: {
            template: "<span></span>"
        }
    },
    computed: {
        tasks: function() {
            return agrippa.tasks;
        },
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
        currentTask: function () {
            if (this.taskKey in agrippa.tasks) {
                return agrippa.tasks[this.taskKey];
            } else {
                return agrippa.defaultTask;
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
        currentPlugin: function () {
            if ('plugin' in this.currentTask) {
                return agrippa.plugins[this.currentTask.plugin];
            } else {
                // this could happen if the task is configured incorrectly
                // or when agrippa.defaultTask is an empty object since it hasn't been populated yet
                return null;
            }
        },
    },
    watch: {
        currentPlugin: function (newPlugin, oldPlugin) {
            const vueInstance = this;
            if (newPlugin) {
                newPlugin.prompt(this.currentTask, this.taskInput)
                    .then(function (result) {
                        vueInstance.output = result;
                    })
                    .catch(function (error) {
                        // TODO
                    });
            } else {
                vueInstance.output = {
                    template: "<span></span>"
                };
            }
        }
    },
    methods: {
        activateTask: function (event) {
            if (this.currentPlugin) {
                this.currentPlugin.activate(this.currentTask, this.taskInput)
                    .then(function (result) {
                        this.output = result;
                    })
                    .catch(function (error) {
                        // TODO
                    });
            } else {
                this.output = {
                    template: "<span></span>"
                };
            }
        }
    }
});
