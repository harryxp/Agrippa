const agrippaPluginTaskSearch = {
    name: "TaskSearch",
    prompt: function (task, taskInput, plugin) {
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
    activate: function (task, taskInput, plugin) {
        return plugin.prompt(task, taskInput);
    },
};
