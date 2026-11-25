let budget = Number(localStorage.getItem('budget')) || 0;
let expenses = [];
let storedExpenses = localStorage.getItem('expenses');

if (storedExpenses) {
    try {
        let parsedExpenses = JSON.parse(storedExpenses);
        if (Array.isArray(parsedExpenses)) {
            for (let i = 0; i < parsedExpenses.length; i++) {
                let expense = parsedExpenses[i];
                if (expense &&
                    typeof expense.name === "string" &&
                    typeof expense.amount === "number" &&
                    expense.amount > 0) {
                    expenses.push(expense);
                }
            }
        }
    } catch (error) {
        localStorage.removeItem('expenses');
    }
}
let budgetForm = document.getElementById("budget-form");
let expenseForm = document.getElementById("expense-form");
let message = document.getElementById("form-message");

function getTotalSpent() {
    let total = 0;
    for (let i = 0; i < expenses.length; i++) {
        total = total + expenses[i].amount;
    }
    return total;
}
function formatMoney(amount) {
    return "$" + amount.toFixed(2);
}
function showExpenses() {
    let list = document.getElementById("expense-list");
    list.textContent = "";
    document.getElementById("empty-state").hidden = expenses.length > 0;
    for (let i = 0; i < expenses.length; i++) {
        let item = document.createElement("li");
        let expenseName = document.createElement("span");
        let expenseAmount = document.createElement("span");
        let removeButton = document.createElement("button");

        item.className = "expense-item";
        expenseName.textContent = expenses[i].name;
        expenseAmount.textContent = formatMoney(expenses[i].amount);
        removeButton.textContent = "Remove";
        removeButton.type = "button";
        removeButton.onclick = function () {
            expenses.splice(i, 1);
            localStorage.setItem('expenses', JSON.stringify(expenses));
            showBudget();
        };

        item.appendChild(expenseName);
        item.appendChild(expenseAmount);
        item.appendChild(removeButton);
        list.appendChild(item);
    }
}
function showBudget() {
    let totalSpent = getTotalSpent();
    let moneyLeft = budget - totalSpent;
    let percentSpent = 0;

    if (budget > 0) {
        percentSpent = totalSpent / budget * 100;
    }

    if (percentSpent > 100) {
        percentSpent = 100;
    }

    document.getElementById("budget-summary").hidden = budget === 0;
    document.getElementById("budget-total").textContent = formatMoney(budget);
    document.getElementById("spent-total").textContent = formatMoney(totalSpent);
    document.getElementById("remaining-amount").textContent = formatMoney(moneyLeft);
    document.getElementById("progress-fill").style.width = percentSpent + "%";

    showExpenses();
}
budgetForm.onsubmit = function (event) {
    event.preventDefault();
    let newBudget = Number(document.getElementById("budget-amount").value);
    if (newBudget <= 0) {
        alert('Enter a budget greater than zero.')
    } else if (newBudget < getTotalSpent()) {
        alert('Your budget cannot be less than what you have spent.')
    } else {
        budget = newBudget;
        localStorage.setItem('budget', JSON.stringify(budget));
        alert('Budget saved.')
        showBudget();
    }
};
expenseForm.onsubmit = function (event) {
    event.preventDefault();

    let name = document.getElementById("expense-name").value.trim();
    let amount = Number(document.getElementById("expense-amount").value);

    if (budget === 0) {
        alert('Set your budget before adding expenses.')
    } else if (name === "" || amount <= 0) {
        alert('Enter an expense name and amount.')
    } else if (getTotalSpent() + amount > budget) {
        alert('That expense would put you over your budget.')
    } else {
        expenses.push({ name: name, amount: amount });
        expenseForm.reset();
        localStorage.setItem('expenses', JSON.stringify(expenses));
        alert('Expense added.')
        showBudget();
    }
};

if (budget > 0) {
    document.getElementById("budget-amount").value = budget;
}

showBudget();
