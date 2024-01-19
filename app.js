import { expenses } from "./data.js";
import * as el from "./elements.js";

(function init() {
  renderExpenses(expenses); // Initial render
  initEventListeners();
  updateSummary(); // Initial summary
})();

function initEventListeners() {
  const expenseNameInput = document.querySelector("input#expense-name");

  enableIncomeInput();

  enableExpenseDeletion();
  enableExpenseAddition();
  // enableExpenseEdit();

  el.expenseNameInput.addEventListener("blur", () => {
    checkDuplicateExpense(el.expenseNameInput.value);
  });
}

// Render and build elements

function renderExpenses(expenses) {
  /* */
  const expenseList = document.querySelector(".expense-list");

  expenses.forEach((expense) => {
    const expenseItem = buildExpenseItem(expense);
    renderExpense(el.expensesList, expenseItem);
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
    <li class="expense-item" id="${name.toLowerCase().replace(" ", "-")}">
      <div class="expense-info">
        <span class="expense-name">${name}</span>
        <span class="expense-amount">${formatCurrency(amount)}</span>
      </div>
      
      <div class="expense-buttons">
        
        <button class="delete-expense" aria-label="Delete ${name}">
          <span class="material-symbols-outlined">delete</span>
        </button>
      </div>
    </li>`;

  // <button class="edit-expense" aria-label="Edit ${name}">
  //       <span class="material-symbols-outlined">edit</span>
  //     </button>

  return listItem;
}

// Expense management functions

function addExpense() {
  /* */

  const name = el.expenseNameInput.value;
  const amount = Number(el.expenseAmountInput.value);

  const newExpense = { name, amount };

  // Check for empty or invalid inputs

  if (!name || !amount || isNaN(amount)) {
    console.log("Please enter a name and amount for the expense.");
    return;
  }

  // Check for duplicate expense, if true, notify user and return

  if (checkDuplicateExpense(name)) {
    return;
  }

  // Add new expense to expenses array

  expenses.push(newExpense);

  // Render new expense to DOM, update summary, and enable deletion/edit for new expense

  renderExpense(el.expensesList, buildExpenseItem(newExpense));
  updateSummary();
  enableExpenseDeletion();
  // enableExpenseEdit();

  // Clear inputs

  el.expenseNameInput.value = "";
  el.expenseAmountInput.value = "";
}

function removeExpense(expenseName) {
  /* */
  const expenseIndex = expenses.findIndex((expense) => expense.name.toLowerCase() === expenseName);

  // Remove expense from data
  expenses.splice(expenseIndex, 1);

  const expenseItem = document.getElementById(expenseName);

  // Remove expense from DOM
  expenseItem.remove();
}

function editExpense(expenseName) {
  /* */
  const expenseAmountSpan = document.querySelector(`#${expenseName} .expense-amount`);
  const savedAmount = Number(expenseAmountSpan.textContent.replace(/[^0-9.-]+/g, ""));
  const expenseEditButton = document.querySelector(`#${expenseName} .edit-expense`);

  // Create and build check button
  const expenseCheckButton = document.createElement("button");
  expenseCheckButton.classList.add("confirm-edit");
  expenseCheckButton.innerHTML = `<span class="material-symbols-outlined">check</span>`;

  // Create input and set value to saved amount
  const editExpenseAmountInput = document.createElement("input");
  editExpenseAmountInput.type = "number";
  editExpenseAmountInput.value = savedAmount;

  // Replace span with input and edit button with check button
  expenseAmountSpan.replaceWith(editExpenseAmountInput);
  expenseEditButton.replaceWith(expenseCheckButton);

  editExpenseAmountInput.addEventListener("blur", (event) => {
    /* */
    handleExpenseUpdate(event);
  });

  editExpenseAmountInput.addEventListener("input", (event) => {
    /* */
    handleExpenseUpdate(event);
  });

  expenseCheckButton.addEventListener("click", (event) => {
    /* */
    handleExpenseUpdate(event);
  });

  function handleExpenseUpdate(event) {
    /* */
    const newAmount = Number(editExpenseAmountInput.value);

    if (!newAmount || isNaN(newAmount)) {
      editExpenseAmountInput.replaceWith(expenseAmountSpan);
      return;
    }

    // Update DOM and data
    expenseAmountSpan.textContent = formatCurrency(newAmount);

    // Swap back to original DOM elements
    if (event && event.type === "blur") {
      editExpenseAmountInput.replaceWith(expenseAmountSpan);
      expenseCheckButton.replaceWith(expenseEditButton);
    }

    if (event && event.type === "input") {
      console.log({ newAmount, savedAmount });
    }

    if (event && event.type === "click") {
      editExpenseAmountInput.replaceWith(expenseAmountSpan);
      expenseCheckButton.replaceWith(expenseEditButton);
    }

    // Update data
    const expenseIndex = expenses.findIndex((expense) => expense.name.toLowerCase() === expenseName);
    expenses[expenseIndex].amount = newAmount;

    // Update summary
    updateSummary();
  }
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

// Summary logic

function updateSummary() {
  /* */
  const [incomeSummary, expenseSummary, balanceSummary] = el.summaryPanel.querySelectorAll(".summary-amount");

  // Calculations
  const income = updateIncome(el.incomeInput, incomeSummary);
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

  // If input is empty, use summary value
  if (input.value) {
    income = Number(input.value);
  }

  // If input is not empty, use input value
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

// Helper functions

function formatCurrency(amount) {
  return amount.toLocaleString("en-US", { style: "currency", currency: "USD" });
}

// Event listener registration

function enableExpenseDeletion() {
  /* */
  const expenseList = document.querySelector(".expense-list");
  const deleteButtons = expenseList.querySelectorAll(".delete-expense");

  deleteButtons.forEach((button) => {
    button.addEventListener("click", (event) => {
      const expenseName = event.target.closest(".expense-item").id;
      removeExpense(expenseName);
      updateSummary();
    });
  });
}

function enableExpenseEdit() {
  /* */
  const expenseList = document.querySelector(".expense-list");
  const editButtons = expenseList.querySelectorAll(".edit-expense");

  editButtons.forEach((button) => {
    button.addEventListener("click", (event) => {
      editExpense(event.target.closest(".expense-item").id);
    });
  });
}

function enableExpenseAddition() {
  /* */
  const addExpenseButton = document.querySelector(".add-expense-button");

  addExpenseButton.addEventListener("click", (event) => {
    event.preventDefault();
    addExpense();
  });
}

function enableIncomeInput() {
  /* */
  const incomeInput = document.querySelector("input#income");

  incomeInput.addEventListener("input", () => {
    updateSummary();
  });

  incomeInput.addEventListener("blur", () => {
    incomeInput.value = "";
  });
}
