import { expenses } from "./data.js";

(function init() {
  renderExpenses(expenses);
  initEventListeners();
  updateSummary();
})();

function initEventListeners() {
  const incomeInput = document.querySelector("input#income");
  const addExpenseButton = document.querySelector(".add-expense-button");
  const expenseNameInput = document.querySelector("input#expense-name");

  incomeInput.addEventListener("input", () => {
    updateSummary();
  });

  incomeInput.addEventListener("blur", () => {
    incomeInput.value = "";
  });

  expenseNameInput.addEventListener("blur", () => {
    checkDuplicateExpense(expenseNameInput.value);
  });

  addExpenseButton.addEventListener("click", (event) => {
    event.preventDefault();
    addExpense();
  });
}

function renderExpenses(expenses) {
  /* */
  const expenseList = document.querySelector(".expense-list");

  expenses.forEach((expense) => {
    const expenseItem = buildExpenseItem(expense);
    renderExpense(expenseList, expenseItem);
  });

  const allDeleteButtons = expenseList.querySelectorAll(".delete-expense");

  allDeleteButtons.forEach((button) => {
    button.addEventListener("click", (event) => {
      const expenseName = event.target.closest(".expense-item").id;
      console.log(expenseName);
      removeExpense(expenseName);
      updateSummary();
    });
  });

  return expenses;
}

function renderExpense(expenseList, expenseItem) {
  expenseList.insertAdjacentHTML("beforeend", expenseItem);
}

function buildExpenseItem(expense) {
  /* */
  const { name, amount } = expense;

  const listItem = `
    <li class="expense-item" id="${name.toLowerCase()}">
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

function addExpense() {
  /* */
  const expenseNameInput = document.getElementById("expense-name");
  const expenseAmountInput = document.getElementById("expense-amount");

  const name = expenseNameInput.value;
  const amount = Number(expenseAmountInput.value);

  const newExpense = { name, amount };

  // Validation

  if (!name || !amount || isNaN(amount)) {
    console.log("Please enter a name and amount for the expense.");
    return;
  }

  if (checkDuplicateExpense(name)) {
    return;
  }

  // Add new expense to expenses array

  expenses.push(newExpense);

  // Render new expense to DOM

  renderExpense(document.querySelector(".expense-list"), buildExpenseItem(newExpense));
  updateSummary();

  // Clear inputs

  expenseNameInput.value = "";
  expenseAmountInput.value = "";
}

function removeExpense(expenseName) {
  /* */
  const expenseIndex = expenses.findIndex((expense) => expense.name.toLowerCase() === expenseName);

  expenses.splice(expenseIndex, 1);

  const expenseItem = document.getElementById(expenseName);

  expenseItem.remove();
}

function updateSummary() {
  /* */
  const summaryPanel = document.querySelector(".summary-panel");
  const [incomeSummary, expenseSummary, balanceSummary] = summaryPanel.querySelectorAll(".summary-amount");
  const incomeInput = document.querySelector("input#income");

  // Calculations

  const income = updateIncome(incomeInput, incomeSummary);
  const expenseTotal = updateExpenseTotal(expenses); // Accesses the data.js file
  const balance = income - expenseTotal;

  // Update DOM

  incomeSummary.textContent = formatCurrency(income);
  balanceSummary.textContent = formatCurrency(balance);
  expenseSummary.textContent = formatCurrency(expenseTotal);

  // UX for NaN values

  if (incomeSummary.textContent.includes("NaN")) {
    incomeSummary.textContent = formatCurrency(0);
  }

  if (balanceSummary.textContent.includes("NaN")) {
    balanceSummary.textContent = formatCurrency(0);
  }

  // Conditionally style balance

  if (balance < 0) {
    balanceSummary.classList.add("negative");
  } else {
    balanceSummary.classList.remove("negative");
  }
}

function updateIncome(input, summary) {
  /* */
  let income;

  if (input.value) {
    income = Number(input.value);
  }

  if (!input.value) {
    income = Number(summary.textContent.replace(/[^0-9.-]+/g, ""));
  }

  return income;
}

function updateExpenseTotal(expenses) {
  /* */
  const expenseTotal = expenses.reduce((acc, item) => acc + item.amount, 0);

  return expenseTotal;
}

function checkDuplicateExpense(name) {
  /* */
  const expenseNames = expenses.map((expense) => expense.name.toLowerCase());

  if (expenseNames.includes(name.toLowerCase())) {
    console.log("This expense already exists.");
    return true;
  }

  return false;
}

function formatCurrency(amount) {
  return amount.toLocaleString("en-US", { style: "currency", currency: "USD" });
}
