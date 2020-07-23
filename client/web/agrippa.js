"use strict";

///////////////////////
// Plugins and Tasks //
///////////////////////

// holds defaultTask, tasks, and plugins
const agrippa = {
    tasks: {},
    defaultTask: {},
    plugins: {
        OnlineSearch: agrippaPluginOnlineSearch,
        Clock: agrippaPluginClock,
        KeePass1: agrippaPluginKeePass1,
        MortgageCalc: agrippaPluginMortgageCalc,
        TaskSearch: agrippaPluginTaskSearch
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
