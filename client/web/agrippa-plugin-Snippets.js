const agrippaPluginSnippets = {
    name: "Clock",
    prompt: function (task, taskInput) {
        console.log(task.snippets);
        return new Promise(function (resolve, reject) {
            resolve({
                data: function () {
                    return {
                        snippets: task.snippets
                    };
                },
                template: `
                    <table>
                        <tr v-for="(snippet, key) in snippets">
                            <td>{{ key }}</td>
                            <td><input class="agrippa-snippet" readonly="" v-bind:value="snippet"></td>
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
