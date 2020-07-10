"use strict";

///////////////////////
// Plugins and Tasks //
///////////////////////

// holds defaultTask, tasks, and plugins
const agrippa = {
    tasks: {},
    defaultTask: {},
    plugins: {
        OnlineSearch: {
            name: "OnlineSearch",
            prompt: function (task, taskInput) {
                return new Promise(function (resolve, reject) {
                    const targetUrl = sprintf(task.url, encodeURIComponent(taskInput));
                    resolve({
                        template: `<span>Keep typing the query. Press &lt;Enter&gt; to visit ${targetUrl}.</span>`
                    });
                });
            },
            activate: function (task, taskInput) {
                return new Promise(function (resolve, reject) {
                    const targetUrl = sprintf(task.url, encodeURIComponent(taskInput));
                    window.location.href = targetUrl;
                    resolve({
                        template: `<span>Visiting ${targetUrl}...</span>`
                    });
                });
            },
        },
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
        KeePass1: {
            name: "KeePass1",
            prompt: function (task, taskInput) {
                return axios.post("/agrippa/keepass1/suggest", {
                        term: taskInput
                    })
                    .then(function (response) {
                        const entries = response.data;
                        if (entries === null) {
                            return {
                                data: function () {
                                    return {
                                        masterPassword: ""
                                    };
                                },
                                // TODO how to focus on password input
                                template: `
                                    <div>
                                        <span>Please provide the master password and press Enter to unlock the database.</span>
                                        <input id="agrippa-keepass1-master-password" type="password" v-model="masterPassword" v-on:keyup.enter="unlock"></input>
                                    </div>
                                `,
                                methods: {
                                    unlock: function () {
                                        axios.post("/agrippa/keepass1/unlock", {
                                            password: this.masterPassword
                                        });
                                    }
                                }
                            };
                        } else {
                            console.log(entries);
                            return {
                                template: "<span>OK</span>"
                            };
                        }
                    })
                    .catch(function (error) {
                        // TODO
                    });
            },
            activate: function (task, taskInput) {
                return new Promise(function (resolve, reject) {
                    resolve({
                        template: "<span>TODO</span>"
                    });
                });
            }
        }
    }
};

// load Agrippa config
(function () {
    axios.get("/agrippa/config")
        .then(function (response) {
            if ("tasks" in response.data && "defaultTask" in response.data) {
                agrippa.tasks = response.data.tasks;
                agrippa.defaultTask = response.data.defaultTask;
            } else {
                const errorMsg = "Config file is missing 'tasks' or 'defaultTask'. Please rectify.";
                agrippaReportError(errorMsg);
            }
        })
        .catch(function (error) {
            const errorMsg = "Failed to load Agrippa config from /agrippa/config. Please check your config file.";
            agrippaReportError(errorMsg);
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
        },
        promptFunctionTimerId: null
    },
    computed: {
        tasks: function () {
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
            if ("plugin" in this.currentTask) {
                return agrippa.plugins[this.currentTask.plugin];
            } else {
                // this could happen if the task is configured incorrectly
                // or when agrippa.defaultTask is an empty object since it hasn't been populated yet
                return null;
            }
        },
    },
    watch: {
        // call plugin's prompt function
        taskInput: function (newInput, oldInput) {
            if (newInput !== oldInput) {
                clearTimeout(this.promptFunctionTimerId);
                const timeout = "keyTimeoutInMs" in this.currentTask ? this.currentTask.keyTimeoutInMs : 0;
                this.promptFunctionTimerId = setTimeout(() => this.updateOutput(this, false), timeout);
            }
        }
    },
    methods: {
        // call plugin's activate function
        activateTask: function (event) {
            this.updateOutput(this, true);
        },
        updateOutput: function (vueInstance, isActivate) {
            if (this.currentPlugin) {
                const action = isActivate ? this.currentPlugin.activate : this.currentPlugin.prompt;
                action(this.currentTask, this.taskInput)
                    .then(function (result) {
                        vueInstance.output = result;
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

///////////////
// Utilities //
///////////////
// TODO alert box https://vuejs.org/v2/guide/components.html#Using-v-model-on-Components
function agrippaReportError(msg) {
    console.error(errorMsg);
    alert(errorMsg);
}
