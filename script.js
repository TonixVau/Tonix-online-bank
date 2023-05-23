"use strict";

/////////////////////////////////////////////////////////////
// Data
/////////////////////////////////////////////////////////////

const accounts = [
  {
    owner: "Tonix Vau",
    movements: [2500, 500, -750, 1200, 3200, -1500, 500, 1200, -1750, 1800],
    interestRate: 1.5, // %
    password: 1234,
    // movementsDates: [
    //   "2021-11-18T21:31:17.178Z",
    //   "2021-12-23T07:42:02.383Z",
    //   "2022-01-28T09:15:04.904Z",
    //   "2022-04-01T10:17:24.185Z",
    //   "2022-07-08T14:11:59.604Z",
    //   "2022-09-18T17:01:17.194Z",
    //   "2022-09-21T23:36:17.929Z",
    //   "2022-09-25T12:51:31.398Z",
    //   "2022-09-28T06:41:26.190Z",
    //   "2022-09-29T08:11:36.678Z",
    // ],
    currency: "USD",
    locale: "en-US",
  },
  {
    owner: "Sunerah Binte Ayesha",
    movements: [
      54500, 3400, -1530, -7904, -32210, -102100, 851200, -30120, 154500,
      -182150,
    ],
    interestRate: 1.3, // %
    password: 5678,
    // movementsDates: [
    //   "2021-12-11T21:31:17.671Z",
    //   "2021-12-27T07:42:02.184Z",
    //   "2022-01-05T09:15:04.805Z",
    //   "2022-02-14T10:17:24.687Z",
    //   "2022-03-12T14:11:59.203Z",
    //   "2022-05-19T17:01:17.392Z",
    //   "2022-08-22T23:36:17.522Z",
    //   "2022-09-25T12:51:31.491Z",
    //   "2022-09-28T06:41:26.394Z",
    //   "2022-09-29T08:11:36.276Z",
    // ],
    currency: "EUR",
    locale: "en-GB",
  },
];

////////////////////////////////////////////////////////////////////////
// Elements
///////////////////////////////////////////////////////////////////////

const labelWelcome = document.querySelector(".welcome");
const labelDate = document.querySelector(".date");
const labelBalance = document.querySelector(".balance-value");
const labelSumIn = document.querySelector(".summary-value-in");
const labelSumOut = document.querySelector(".summary-value-out");
const labelSumInterest = document.querySelector(".summary-value-interest");
const labelTimer = document.querySelector(".timer");

const containerApp = document.querySelector(".app");
const containerMovements = document.querySelector(".movements");

const btnLogin = document.querySelector(".login-btn");
const btnTransfer = document.querySelector(".form-btn-transfer");
const btnLoan = document.querySelector(".form-btn-loan");
const btnClose = document.querySelector(".form-btn-close");
const btnSort = document.querySelector(".btn-sort");

const inputLoginUsername = document.querySelector(".login-input-username");
const inputLoginPassword = document.querySelector(".login-input-password");
const inputTransferTo = document.querySelector(".form-input-to");
const inputTransferAmount = document.querySelector(".form-input-amount");
const inputLoanAmount = document.querySelector(".form-input-loan-amount");
const inputCloseUsername = document.querySelector(".form-input-username");
const inputClosePassword = document.querySelector(".form-input-password");

let currentAccount;
/////////////////////////////////////////////////////////////////////
//update ui
////////////////////////////////////////////////////////////////////
function updateUi() {
  displayBalance(currentAccount);
  displaySummary(currentAccount);
  displayMovement(currentAccount);
}
/////////////////////////////////////////////////////////////////////
// Movments
/////////////////////////////////////////////////////////////////////

function displayMovement(account) {
  containerMovements.innerHTML = ``;
  const moves = account.movements;
  moves.forEach((move, i) => {
    const type = move > 0 ? "deposit" : "withdrawal";
    const html = `
    <div class = "movements-row">
      <div class = "movements-type movements-type-${type}"> ${
      i + 1
    } ${type} </div>
      <div class = "movements-date" > 5 days ago </div>
      <div class = "movements-value"> ${move}$ </div>
      </div>

    `;
    containerMovements.insertAdjacentHTML("afterbegin", html);
  });
}

///////////////////////////////////////////////////////////////////////
// Summary
//////////////////////////////////////////////////////////////////////
function displaySummary(account) {
  //income
  const income = account.movements
    .filter((move) => move > 0)
    .reduce((acc, move) => acc + move, 0);
  labelSumIn.textContent = `${income}$`;
  //outcome
  const outcome = account.movements
    .filter((width) => width < 0)
    .reduce((acc, width) => acc - width, 0);
  labelSumOut.textContent = `${outcome}$`;
  //inerest
  const inerest = account.movements
    .filter((move) => move > 0)
    .map((deposit) => (deposit * account.interestRate) / 100)
    .filter((interest) => interest >= 1)
    .reduce((acc, interest) => acc + interest, 0);
  labelSumInterest.textContent = `${Math.trunc(inerest)}$`;
}
/////////////////////////////////////////////////////////////////
//balance
////////////////////////////////////////////////////////////////

function displayBalance(account) {
  account.balance = account.movements.reduce((acc, blc) => acc + blc, 0);
  labelBalance.textContent = `${account.balance}$`;
}
///////////////////////////////////////////////////////////////////
//Username
//////////////////////////////////////////////////////////////////

function createUserNames(accounts) {
  accounts.forEach((account) => {
    account.username = account.owner
      .toLowerCase()
      .split(" ")
      .map((word) => word.at(0))
      .join("");
    // console.log(account.username);
  });
}
createUserNames(accounts);

//////////////////////////////////////////////////////////////////
//login
//////////////////////////////////////////////////////////////////

btnLogin.addEventListener("click", function (e) {
  e.preventDefault();
  currentAccount = accounts.find(
    (account) => account.username === inputLoginUsername.value
  );
  if (currentAccount?.password === Number(inputLoginPassword.value)) {
    labelWelcome.textContent = `Welcome Back, ${currentAccount.owner
      .split(" ")
      .at(0)}`;
    containerApp.style.opacity = 1;
    updateUi();
  } else {
    //hide ui and waring message
    labelWelcome.textContent = "Login Failed";
    containerApp.style.opacity = 0;
  }

  //clear field
  inputLoginUsername.value = inputLoginPassword.value = "";
  inputLoginPassword.blur();
});

//////////////////////////////////////////////////////////////////
//transfer
////////////////////////////////////////////////////////////////

btnTransfer.addEventListener("click", function (e) {
  e.preventDefault();

  const recevierAccount = accounts.find(
    (account) => account.username === inputTransferTo.value
  );

  const amount = Number(inputTransferAmount.value);

  //clear fields
  inputTransferTo.value = inputTransferAmount.value = "";
  inputTransferAmount.blur();

  if (
    amount > 0 &&
    amount <= currentAccount.balance &&
    currentAccount.username !== recevierAccount.username &&
    recevierAccount
  ) {
    //transfer
    currentAccount.movements.push(-amount);
    recevierAccount.movements.push(amount);
    //update UI
    updateUi(currentAccount);
    //show message
    labelWelcome.textContent = "Transactin Successfull";
  } else {
    labelWelcome.textContent = "Transactin failed!";
  }
});

////////////////////////////////////////////////////////
//loan
//////////////////////////////////////////////////////

btnLoan.addEventListener("click", function (e) {
  e.preventDefault();

  const amount = Number(inputLoanAmount.value);

  if (
    amount > 0 &&
    currentAccount.movements.some((move) => move >= amount * 0.1)
  ) {
    //add positive movement into current account
    currentAccount.movements.push(amount);
    //UI update
    updateUi(currentAccount);
    //Message
    labelWelcome.textContent = "loan successful";
  } else {
    labelWelcome.textContent = "loan not successful";
  }

  inputLoanAmount.value = "";
  inputLoanAmount.blur();
});

///////////////////////////////////////////////////////////////////////////////////////
//close account
//////////////////////////////////////////////////////////////////////////////////////

btnClose.addEventListener("click", function (e) {
  e.preventDefault();

  if (
    currentAccount.username === inputCloseUsername.value &&
    currentAccount.password === Number(inputClosePassword.value)
  ) {
    const index = accounts.findIndex(
      (account) => account.username === currentAccount.username
    );
    //delete
    accounts.splice(index, 1);
    //hdie ui
    containerApp.style.opacity = 0;
    //sms
    labelWelcome.textContent = "account deleted";
  } else {
    labelWelcome.textContent = "delete can not be done";
  }
  inputCloseUsername.value = "";
  inputClosePassword.blur();
});
