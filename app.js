const incomeInput = document.getElementById("income");
const addExpenseDiv = document.getElementById("add-expense");
const [expenseNameInput, expenseAmountInput] = addExpenseDiv.querySelectorAll("input");
const summaryPanel = document.getElementById("summary-panel");
const [totalIncome, totalExpense, balance] = summaryPanel.querySelectorAll(".summary-amount");
const expenseList = document.getElementById("expense-table");
let expenseItems = [];
