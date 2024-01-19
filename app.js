import { expenses } from "./data.js";

(function init() {
  renderExpenses(expenses);
})();

function renderExpenses() {
  /* */
  const expenseList = document.querySelector(".expense-list");

  expenses.forEach((expense) => {
    renderExpense(expenseList, buildExpenseItem(expense));
  });
}

function renderExpense(expenseList, expenseItem) {
  expenseList.insertAdjacentHTML("beforeend", expenseItem);
}

function buildExpenseItem(expense) {
  /* */
  const { name, amount } = expense;

  const listItem = `
    <li class="expense-item" id="${name.toLowerCase().replace(" ", "-")}">
      <div class="expense-info">
        <span class="expense-name">${name}</span>
        <span class="expense-amount">${formatCurrency(amount)}</span>
      </div>
      
      <div class="expense-buttons">
      <button class="edit-expense" aria-label="Edit ${name}">
      <span class="material-symbols-outlined">edit</span>
      </button>
    
        <button class="delete-expense" aria-label="Delete ${name}">
          <span class="material-symbols-outlined">delete</span>
        </button>
      </div>
    </li>`;

  return listItem;
}

function formatCurrency(amount) {
  /* */
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}
