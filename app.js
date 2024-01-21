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
  const { name, amount, type } = expense;

  const listItem = `
    <li class="expense-item" id="${kebabCase(name)}">
      <div class="expense-info">
        <span class="expense-icon material-symbols-outlined">${getExpenseIcon(name) ?? "chevron_right"}</span>
        <div class="expense-name-type">
          <span class="expense-name">${name}</span>
          <span class="expense-type ${type.toLowerCase()}">${type}</span>
        </div>
        <span class="expense-amount">${formatCurrency(amount)}</span>
      </div>      
      <div class="expense-buttons">
        <button class="edit-expense" aria-label="Edit ${name}" type="button">
          <span class="expense-icon material-symbols-outlined edit">edit</span>
        </button>
        <button class="delete-expense" aria-label="Delete ${name}" type="button">
          <span class="expense-icon material-symbols-outlined delete">delete</span>
        </button>
      </div>
    </li>`;

  return listItem;

  function kebabCase(string) {
    /* */
    return string
      .toLowerCase()
      .replace(" ", "-")
      .replace(/[^a-z-]/g, "");
  }

  function getExpenseIcon(name) {
    /* */
    name = kebabCase(name);
    if (["rent", "mortgage"].includes(name)) {
      return "cottage";
    }

    if (["groceries", "food"].includes(name)) {
      return "grocery";
    }

    if (["gas-car", "fuel", "gas"].includes(name)) {
      return "local_gas_station";
    }

    if (["car-payment", "car"].includes(name)) {
      return "car_tag";
    }

    if (["insurance"].includes(name)) {
      return "description";
    }

    if (["electricity", "power", "electric"].includes(name)) {
      return "electric_meter";
    }

    if (["phone", "cell", "cell-phone", "phone-bill"].includes(name)) {
      return "phone_in_talk";
    }

    if (["gas-house", "heating"].includes(name)) {
      return "fireplace";
    }

    if (["internet", "wifi"].includes(name)) {
      return "wifi";
    }

    if (["water"].includes(name.toLowerCase())) {
      return "faucet";
    }

    if (["gym", "gym-membership"].includes(name)) {
      return "exercise";
    }

    if (["savings", "savings-account"].includes(name)) {
      return "savings";
    }

    if (["transportation", "transport"].includes(name)) {
      return "commute";
    }
  }
}

function addExpense() {
  /* */
  const addExpenseButton = document.querySelector(".add-expense-button");

  addExpenseButton.addEventListener("click", handleAddExpense);

  function handleAddExpense(event) {
    /* */
    const expenseName = document.querySelector(".add-expense input[name='expense-name']");
    const expenseAmount = document.querySelector(".add-expense input[name='expense-amount']");
    const domItems = [expenseName, expenseAmount];

    // Create an expense object literal
    const expense = {
      name: expenseName.value,
      amount: Number(expenseAmount.value),
    };

    // Test the expense object
    const testExpenseResult = testExpense(expense, domItems);

    // If the expense object fails the tests, return
    if (!testExpenseResult) {
      return;
    }

    // If the expense object passes the tests, add it to the budget,
    // re-render the budget, and clear the input fields
    budget.expenses.push(expense);
    renderBudget();
    domItems.forEach((item) => (item.value = ""));
  }

  function testExpense(expense, domItems) {
    /* */
    const [expenseName, expenseAmount] = domItems;

    // Does the expense already exist?
    if (budget.expenses.find((item) => item.name === expense.name)) {
      console.log("Expense already exists");
      return;
    }

    // Is the expense name empty?
    if (expenseName.value === "") {
      console.log("Please enter an expense name");
      // TODO: Add a visual cue to the user
      return;
    }

    // Is the expense amount empty?
    if (expenseAmount.value === "") {
      console.log("Please enter an expense amount");
      // TODO: Add a visual cue to the user
      return;
    }

    // Is the expense amount a number?
    if (isNaN(expense.amount)) {
      console.log("Please enter a valid expense amount");
      // TODO: Add a visual cue to the user
      return;
    }

    // Is the expense name too short?
    if (expense.name.length < 3) {
      console.log("Please enter a valid expense name");
      // TODO: Add a visual cue to the user
      return;
    }

    // Is the expense name too long?
    if (expense.name.length > 16) {
      expense.name = expense.name.slice(0, 16) + "...";
    }

    // Is the expense amount too small?
    if (expense.amount < 0) {
      expense.amount = Math.abs(expense.amount);
    }

    // Is the expense amount too large?
    if (expense.amount > 100_000) {
      expense.amount = 100_000;
    }

    return expense;
  }
}

function deleteExpense() {
  /* */
  const deleteExpenseButtons = document.querySelectorAll(".delete-expense");

  deleteExpenseButtons.forEach((button) => {
    button.addEventListener("click", handleDeleteExpense);
  });

  function handleDeleteExpense(event) {
    const expenseItem = event.target.closest(".expense-item");
    const expenseName = expenseItem.querySelector(".expense-name").textContent;

    budget.expenses = budget.expenses.filter((expense) => {
      const expenseFromData = expense.name.toLowerCase().slice(0, expense.name.length - 3);
      const expenseFromDOM = expenseName.toLowerCase().slice(0, expenseName.length - 3);

      return expenseFromData !== expenseFromDOM;
    });

    renderBudget();
  }
}

function formatCurrency(amount) {
  /* */
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}
