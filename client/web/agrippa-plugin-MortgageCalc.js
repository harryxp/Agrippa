const agrippaPluginMortgageCalc = {
    name: "MortgageCalc",
    prompt: function (task, taskInput) {
        return new Promise(function (resolve, reject) {
            resolve({
                template: `
                    <div>
                        <p>Input &lt;Loan Amount&gt; &lt;Interest Rate (%)&gt; &lt;Mortgage Period (years)&gt; then hit &lt;Enter&gt;.</p>
                        <p>E.g.: 300000 4 30&lt;Enter&gt;</p>
                    </div>
                `
            });
        });
    },
    activate: function (task, taskInput) {
        const inputArray = taskInput.split(" ").filter(word => word.length > 0);
        if (inputArray.length !== 3) {
            return agrippaPluginMortgageCalc.prompt(task, taskInput);
        } else {
            const loanAmount = inputArray[0];
            const interestRate = inputArray[1] / 100;
            const years = inputArray[2];
            // TODO validate input: loanAmount, interestRate, years
            return new Promise(function (resolve, reject) {
                const monthlyPayment = agrippaPluginMortgageCalc._calcMonthlyPayment(loanAmount, interestRate, years);
                const amortization = agrippaPluginMortgageCalc._calcAmortization(monthlyPayment, loanAmount, interestRate, years);
                resolve({
                    data: function () {
                        return {
                            monthlyPayment: monthlyPayment,
                            amortization: amortization
                        };
                    },
                    template: `
                        <div>
                            <div>Monthly payment is: {{ Number.parseFloat(monthlyPayment).toFixed(2) }}</div>
                            <table>
                                <tr>
                                    <th>Installment #</th>
                                    <th>Principal</th>
                                    <th>Interest</th>
                                    <th>Balance</th>
                                </tr>
                                <tr v-for="entry in amortization">
                                    <td>{{ entry[0] }}</td>
                                    <td>{{ Number.parseFloat(entry[1]).toFixed(2) }}</td>
                                    <td>{{ Number.parseFloat(entry[2]).toFixed(2) }}</td>
                                    <td>{{ Number.parseFloat(entry[3]).toFixed(2) }}</td>
                                </tr>
                            </table>
                        </div>
                `
                });
            });
        }
    },
    _calcMonthlyPayment: function (loanAmount, interestRate, years) {
        const r = 1 / (1 + interestRate / 12);
        return (r - 1) / (r ** (12 * years + 1) - r) * loanAmount;
    },
    _calcAmortization: function (monthlyPayment, loanAmount, interestRate, years) {
        function helper(period, balance, amortization) {
            if (period >= years * 12) {
                return amortization;
            } else {
                const interestPaidOfMonth = balance * (interestRate / 12);
                const principalPaidOfMonth = monthlyPayment - interestPaidOfMonth;
                const newBalance = balance * (1 + interestRate / 12) - monthlyPayment;
                amortization.push([period + 1, principalPaidOfMonth, interestPaidOfMonth, newBalance]);
                return helper(period + 1, newBalance, amortization);
            }
        }

        return helper(0, loanAmount, [[0, 0, 0, loanAmount]]);
    }
};
