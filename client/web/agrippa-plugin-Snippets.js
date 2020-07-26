const agrippaPluginSnippets = {
    name: "Clock",
    prompt: function (task, taskInput) {
        return new Promise(function (resolve, reject) {
            resolve({
                computed: {
                    matchedSnippets: function () {
                        const matchedSnippets = {};
                        for (const snippetKey in task.snippets) {
                            const idx = snippetKey.toLowerCase().indexOf(taskInput.toLowerCase());
                            if (idx !== -1) {
                                matchedSnippets[snippetKey] = {
                                    prefix: snippetKey.slice(0, idx),
                                    matched: snippetKey.slice(idx, idx + taskInput.length),
                                    suffix: snippetKey.slice(idx + taskInput.length),
                                    snippetValue: task.snippets[snippetKey]
                                };
                            }
                        }
                        return matchedSnippets;
                    }
                },
                template: `
                    <table>
                        <tr v-for="(snippetInfo, snippetKey) in matchedSnippets">
                            <td>{{ snippetInfo.prefix }}<span class="agrippa-highlighted-text">{{ snippetInfo.matched }}</span>{{ snippetInfo.suffix }}</td>
                            <td><input class="agrippa-snippet" readonly="" v-bind:value="snippetInfo.snippetValue"></td>
                            <td><button v-on:click="copySnippet">Copy</button></td>
                        </tr>
                    </table>
                `,
                methods: {
                    copySnippet: function (event) {
                        event.target.parentNode.previousElementSibling.childNodes[0].select();
                        document.execCommand("copy");
                    }
                }
            });
        });
    },
    activate: function (task, taskInput) {
        return agrippaPluginSnippets.prompt(task, taskInput);
    },
};
