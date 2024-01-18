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
  const expenseTable = document.querySelector(".expense-table");

  expenses.forEach((expense) => {
    const expenseItem = buildExpenseItem(expense);
    expenseTable.insertAdjacentHTML("beforeend", expenseItem);
  });

  return expenses;
}

function buildExpenseItem(expense) {
  const { name, amount } = expense;

  return `
      <div class="expense-name">${name}</div>
      <div class="expense-amount">${amount}</div>
      <div class="delete">
        <button name="delete-expense" class="delete-expense">
          <img src="./images/trash.svg" alt="Delete expense" />
        </button>
      </div>`;
}

function updateSummary() {
  const summaryPanel = document.querySelector(".summary-panel");
  const [incomeSummary, expenseSummary, balanceSummary] = summaryPanel.querySelectorAll(".summary-amount");
  const income = Number(document.getElementById("income").value);
  const expenseItems = [...document.querySelectorAll(".expense-amount")].map((item) => Number(item.textContent));
  const expense = expenseItems.reduce((acc, item) => acc + item, 0);
  const balance = income - expense;

  incomeSummary.textContent = formatCurrency(income);
  expenseSummary.textContent = formatCurrency(expense);
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
