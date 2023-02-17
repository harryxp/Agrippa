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
        Snippets: agrippaPluginSnippets,
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
            const errorMsg = `Failed to load Agrippa config from /agrippa/config - ${error}. Please check your config file.`;
            agrippaReportError(errorMsg);
        });
})();
