const expenseNameInput = document.querySelector("input#expense-name");
const expenseAmountInput = document.querySelector("input#expense-amount");
const expensesList = document.querySelector(".expense-list");
const allEditButtons = expensesList.querySelectorAll(".edit-expense");
const allDeleteButtons = expensesList.querySelectorAll(".delete-expense");
const summaryPanel = document.querySelector(".summary-panel");
const incomeInput = document.querySelector("input#income");
const addExpenseButton = document.querySelector(".add-expense-button");

export {
  expenseNameInput,
  expenseAmountInput,
  expensesList,
  allEditButtons,
  allDeleteButtons,
  summaryPanel,
  incomeInput,
  addExpenseButton,
};
