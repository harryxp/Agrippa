"use strict";

const agrippaPluginKeePass1 = {
    name: "KeePass1",
    prompt: function (task, taskInput) {
        return axios.post("/agrippa/keepass1/suggest", {
                term: taskInput
            })
            .then(function (response) {
                const entries = response.data;
                return {
                    data() {
                        return {
                            entries: entries
                        };
                    },
                    template: `
                        <div>
                            <div v-for="entry in entries">
                                <div>{{ entry.Title }}</div>
                                <div><a v-bind:href="entry.URL">{{ entry.URL }}</a></div>

                                <span>UserName</span>
                                <input readonly="" v-bind:value="entry.UserName">
                                <button v-on:click="copyPrevInput">Copy</button>

                                <span>Password</span>
                                <input readonly="" class="agrippa-keepass1-password" v-bind:value="entry.Password">
                                <button v-on:click="copyPrevInput">Copy</button>

                                <pre>{{ entry.Comment }}</pre>
                                <hr>
                            </div>
                        </div>
                    `,
                    methods: {
                        copyPrevInput: function (event) {
                            event.target.previousElementSibling.select();
                            // TODO deprecated
                            document.execCommand("copy");
                            // TODO hack - move focus back to agrippa-input to avoid showing password
                            document.getElementById("agrippa-input").focus();
                        }
                    }
                };
            })
            .catch(function (error) {
                var userMessage = "Unknown error";
                if (error.response.status === 401) {
                    return {
                        data() {
                            return {
                                masterPassword: ""
                            };
                        },
                        // TODO how to focus on password input
                        // TODO try searching automatically after unlocking
                        template: `
                            <div>
                                <span>Please provide the master password and press Enter to unlock the database.</span>
                                <input id="agrippa-keepass1-master-password" type="password" v-model="masterPassword" v-on:keyup.enter="unlock">
                            </div>
                        `,
                        methods: {
                            unlock: function () {
                                axios.post("/agrippa/keepass1/unlock", {
                                    password: this.masterPassword
                                });
                                document.getElementById("agrippa-input").focus();
                            }
                        }
                    };
                } else if (error.response.status === 400 && error.response.data.endsWith("ConfigError")) {
                    userMessage = "Please make sure 'tasks' or 'databaseFilePath' is properly set in your config file.";
                } else if (error.response.status === 400 && error.response.data.endsWith("FileNotFoundError")) {
                    userMessage = `Failed to read KeePass file.
                                   Please make sure 'databaseFilePath' is properly set in your config file.
                                   `;
                } else if (error.response.status === 400 && error.response.data.endsWith("DecryptionError")) {
                    // TODO this is (almost) copy-paste now
                    return {
                        data() {
                            return {
                                masterPassword: ""
                            };
                        },
                        // TODO how to focus on password input
                        // TODO try searching automatically after unlocking
                        template: `
                            <div>
                                <span>Failed to decrypt KeePass file.  Please provide the master password and press Enter to unlock the database.</span>
                                <input id="agrippa-keepass1-master-password" type="password" v-model="masterPassword" v-on:keyup.enter="unlock">
                            </div>
                        `,
                        methods: {
                            unlock: function () {
                                axios.post("/agrippa/keepass1/unlock", {
                                    password: this.masterPassword
                                });
                                document.getElementById("agrippa-input").focus();
                            }
                        }
                    };
                }

                return {
                    template: `<span>${ userMessage }</span>`
                };
            });
    },
    activate: function (task, taskInput) {
        return new Promise(function (resolve, reject) {
            resolve({
                template: "<span>TODO</span>"
            });
        });
    }
};
