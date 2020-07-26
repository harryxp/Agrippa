"use strict";

const agrippaPluginTaskSearch = {
    name: "TaskSearch",
    prompt: function (task, taskInput) {
        return new Promise(function (resolve, reject) {
            resolve({
                computed: {
                    matchedTasks: function () {
                        const matchedTasks = {};
                        for (const taskKey in agrippa.tasks) {
                            const taskName = agrippa.tasks[taskKey].name;
                            const pluginName = agrippa.tasks[taskKey].plugin;
                            const idx = taskName.toLowerCase().indexOf(taskInput.toLowerCase());
                            if (idx !== -1) {
                                matchedTasks[taskKey] = {
                                    prefix: taskName.slice(0, idx),
                                    matched: taskName.slice(idx, idx + taskInput.length),
                                    suffix: taskName.slice(idx + taskInput.length),
                                    pluginName: pluginName
                                };
                            }
                        }
                        return matchedTasks;
                    }
                },
                template: `
                    <div>
                        <table>
                            <tr><th>Keyword</th><th>Task</th><th>Plugin</th></tr>
                            <tr v-for="(taskInfo, taskKey) in matchedTasks">
                                <td>{{ taskKey }}</td>
                                <td>{{ taskInfo.prefix }}<span class="agrippa-highlighted-text">{{ taskInfo.matched }}</span>{{ taskInfo.suffix }}</td>
                                <td>{{ taskInfo.pluginName }}</td>
                                <td><button v-on:click="selectTask">Select Task</button></td>
                            </tr>
                        </table>
                    </div>
                `,
                methods: {
                    selectTask: function (event) {
                        const keyword = event.target.parentNode.parentNode.childNodes[0].childNodes[0];
                        const agrippaInput = document.getElementById("agrippa-input");
                        agrippaInput.value = keyword.textContent + " ";
                        // directly setting input value does not trigger Vue v-model update so we need this
                        agrippaInput.dispatchEvent(new Event('input'));
                        agrippaInput.focus();
                    }
                }
            });
        });
    },
    activate: function (task, taskInput) {
        return agrippaPluginTaskSearch.prompt(task, taskInput);
    },
};
