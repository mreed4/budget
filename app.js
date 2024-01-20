import { budget } from "./data.js";

(function init() {
  console.log(budget.expenses);
  renderBudget();
  initEventListeners();
})();

function initEventListeners() {
  updateIncome();
  addExpense();
  deleteExpense();
}

function renderBudget() {
  const summaryPanel = document.querySelectorAll(".summary-panel .summary-amount");
  const [incomeSummary, expenseSummary, balanceSummary] = summaryPanel;
  const expenseList = document.querySelector(".expense-list");

  const { income, expenses } = budget;
  const totalExpenses = expenses.reduce((total, expense) => total + expense.amount, 0);
  const balance = income - totalExpenses;

  if (expenseList.hasChildNodes()) {
    expenseList.innerHTML = "";
  }

  budget.expenses.forEach((expense) => {
    renderExpense(expenseList, buildExpenseItem(expense));
  });

  incomeSummary.textContent = formatCurrency(income);
  expenseSummary.textContent = formatCurrency(totalExpenses);
  balanceSummary.textContent = formatCurrency(balance);

  if (isNaN(income)) {
    incomeSummary.textContent = formatCurrency(0);
  }

  if (isNaN(balance)) {
    balanceSummary.textContent = formatCurrency(0);
  }

  if (balance < 0) {
    balanceSummary.classList.remove("positive");
    balanceSummary.classList.add("negative");
  }

  if (balance >= 0) {
    balanceSummary.classList.remove("negative");
    balanceSummary.classList.add("positive");
  }

  deleteExpense();
}

function updateIncome() {
  /* */
  const incomeInput = document.querySelector("input[name='income']");

  const handleIncomeBlur = incomeInput.addEventListener("blur", (event) => {
    incomeInput.value = "";
  });

  const handleIncomeInput = incomeInput.addEventListener("input", (event) => {
    const income = Number(event.target.value);
    budget.income = income;
    renderBudget();
  });

  incomeInput.removeEventListener("blur", () => {
    console.log("blur event removed");
    handleIncomeBlur();
  });

  incomeInput.removeEventListener("input", () => {
    console.log("input event removed");
    handleIncomeInput();
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

function addExpense() {
  const addExpenseButton = document.querySelector(".add-expense-button");
  /* */

  addExpenseButton.addEventListener("click", () => {
    const expenseName = document.querySelector(".add-expense input[name='expense-name']");
    const expenseAmount = document.querySelector(".add-expense input[name='expense-amount']");

    const expense = {
      name: expenseName.value,
      amount: Number(expenseAmount.value),
    };

    if (budget.expenses.find((item) => item.name === expense.name)) {
      console.log("Expense already exists");
      return;
    }

    if (expenseName.value === "") {
      console.log("Please enter an expense name");
      return;
    }

    if (expenseAmount.value === "") {
      console.log("Please enter an expense amount");
      return;
    }

    if (isNaN(expense.amount)) {
      console.log("Please enter a valid expense amount");
      return;
    }

    if (expense.name.length < 3) {
      console.log("Please enter a valid expense name");
      return;
    }

    if (expense.name.length > 16) {
      expense.name = expense.name.slice(0, 16) + "...";
    }

    if (expense.amount > 100_000) {
      expense.amount = 100_000;
    }

    if (expense.amount < 0) {
      expense.amount = Math.abs(expense.amount);
    }

    budget.expenses.push(expense);

    renderBudget();

    expenseName.value = "";
    expenseAmount.value = "";
  });
}

function deleteExpense() {
  /* */
  const deleteExpenseButtons = document.querySelectorAll(".delete-expense");

  deleteExpenseButtons.forEach((button) => {
    const handleDeleteButton = button.addEventListener("click", (event) => {
      const expenseItem = event.target.closest(".expense-item");
      const expenseName = expenseItem.querySelector(".expense-name").textContent;

      budget.expenses = budget.expenses.filter((expense) => {
        const expenseFromData = expense.name.toLowerCase().slice(0, expense.name.length - 3);
        const expenseFromDOM = expenseName.toLowerCase().slice(0, expenseName.length - 3);

        return expenseFromData !== expenseFromDOM;
      });

      renderBudget();
    });

    button.removeEventListener("click", () => {
      console.log("click event removed");
      handleDeleteButton();
    });
  });
}

function formatCurrency(amount) {
  /* */
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}
