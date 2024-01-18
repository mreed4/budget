import { expenses } from "./data.js";

(function init() {
  renderExpenses(expenses);
  initEventListeners();
  updateSummary();
})();

function initEventListeners() {
  const incomeInput = document.querySelector("input#income");

  incomeInput.addEventListener("input", updateSummary);
}

function renderExpenses(expenses) {
  const expenseList = document.querySelector(".expense-list");

  expenses.forEach((expense) => {
    const expenseItem = buildExpenseItem(expense);
    expenseList.insertAdjacentHTML("beforeend", expenseItem);
  });

  return expenses;
}

function buildExpenseItem(expense) {
  const { name, amount } = expense;

  return `
    <li class="expense-item" id="${name.toLowerCase()}">
      <div>
        <span class="expense-name">${name}</span>
        <span class="expense-amount">${formatCurrency(amount)}</span>
      </div>
      <button class="delete-expense" aria-label="Delete ${name}">
        <img src="./images/trash.svg" alt="Delete ${name}" />
      </button>
    </li>`;
}

function updateSummary() {
  const summaryPanel = document.querySelector(".summary-panel");
  const [incomeSummary, expenseSummary, balanceSummary] = summaryPanel.querySelectorAll(".summary-amount");
  const income = Number(document.getElementById("income").value);
  const expenseTotal = expenses.reduce((acc, item) => acc + item.amount, 0);
  const balance = income - expenseTotal;

  incomeSummary.textContent = formatCurrency(income);
  expenseSummary.textContent = formatCurrency(expenseTotal);
  balanceSummary.textContent = formatCurrency(balance);

  if (balance < 0) {
    balanceSummary.classList.add("negative");
  } else {
    balanceSummary.classList.remove("negative");
  }
}

function formatCurrency(amount) {
  return amount.toLocaleString("en-US", { style: "currency", currency: "USD" });
}
