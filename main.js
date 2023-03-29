console.log("ATM running");
// Class User
class User {
  constructor({ username, pin, balance }) {
    this.username = username;
    this.pin = pin;
    this.balance = balance;
  }
}

// Class ATM
class ATM {
  #users;
  #authenticatedUser;

  constructor({ users }) {
    this.#users = users;
    this.#authenticatedUser = null;
  }

  authentication(username, pin) {
    const user = this.#users.find(
      (user) => user.username.toLowerCase() === username.toLowerCase()
    );

    if (!user) {
      console.log("User not found");
      return null;
    }

    if (user.pin === pin) {
      console.log(`User ${user.username} authenticated`);
      this.#authenticatedUser = user;
      return user;
    } else {
      console.log("Incorrect pin");
      return null;
    }
  }

  deposit(amount) {
    if (Number.isNaN(amount)) {
      console.log("Error Deposit: Invalid amount");
      return null;
    }
    if (!this.#authenticatedUser) {
      console.log("Error Deposit: User not authenticated");
      return null;
    }
    if (this.#authenticatedUser.balance + amount > 990) {
      console.log("Error Deposit: Maximum amount exceeded");
      return null;
    }
    this.#authenticatedUser.balance += amount;
    return this.#authenticatedUser.balance;
  }

  withdraw(amount) {
    if (Number.isNaN(amount)) {
      console.log("Error Deposit: Invalid amount");
      return null;
    }
    if (!this.#authenticatedUser) {
      console.log("Error Withdraw: User not authenticated");
      return;
    }
    if (this.#authenticatedUser.balance < amount) {
      console.log("Error Withdraw: Insufficient funds");
      return;
    }
    if (this.#authenticatedUser.balance - amount < 10) {
      console.log("Error Withdraw: Minimum amount not reached");
      return;
    }
    this.#authenticatedUser.balance -= amount;
    return this.#authenticatedUser.balance;
  }

  checkBalance() {
    if (!this.#authenticatedUser) {
      console.log("Error Check Balance: User not authenticated");
      return;
    }
    console.log(`Balance: $${this.#authenticatedUser.balance}`);
    return this.#authenticatedUser.balance;
  }

  logout() {
    if (!this.#authenticatedUser) {
      console.log("Error Logout: User not authenticated");
      return;
    }
    console.log(`User ${this.#authenticatedUser.username} logged out`);
    this.#authenticatedUser = null;
  }

  get authenticatedUser() {
    return this.#authenticatedUser?.username;
  }

  // todo: delete this (only for testing)
  get users() {
    return this.#users;
  }
}

// App
const app = () => {
  // state
  const state = {
    users: [],
    state: 'auth', // states: auth, options, deposit, withdraw, balance
  };

  // Create Users
  state.users = [
    new User({
      username: "stiven trujillo",
      pin: "1234",
      balance: 500,
    }),
    new User({
      username: "lisbeth cifuentes",
      pin: "4321",
      balance: 600,
    }),
  ];

  // instance ATM class
  const atm = new ATM({ users: state.users });

  // get HTML elements
  const okButton = document.getElementById("okButton");
  const deleteButton = document.getElementById("deleteButton");
  const checkButton = document.getElementById("checkButton");
  const depositButton = document.getElementById("depositButton");
  const withdrawButton = document.getElementById("withdrawButton");
  const backButton = document.getElementById("backButton");
  const cardUserName = document.getElementById("cardUserName");
  const cardPin = document.getElementById("cardPin");
  const amount = document.getElementById("amount");
  const numberPad = [];
  numberPad[0] = document.getElementById("button1");
  numberPad[1] = document.getElementById("button2");
  numberPad[2] = document.getElementById("button3");
  numberPad[3] = document.getElementById("button4");
  numberPad[4] = document.getElementById("button5");
  numberPad[5] = document.getElementById("button6");
  numberPad[6] = document.getElementById("button7");
  numberPad[7] = document.getElementById("button8");
  numberPad[8] = document.getElementById("button9");
  numberPad[9] = document.getElementById("button0");
  const screenMessage = document.getElementById("screenMessage");

  // define functions
  function typePin() {
    console.log(state.state)
    if (state.state === 'auth') {
      if (cardPin.value.length < 4) {
        cardPin.value += this.textContent;
        console.log(cardPin.value);
      }
    } else if (state.state === 'deposit' || state.state === 'withdraw') {
      if (amount.value.length < 3) {
        amount.value += this.textContent;
        console.log(amount.value);
      }
    }
  }

  function authenticate() {
    console.log('authenticating...')

    const user = atm.authentication(cardUserName.value, cardPin.value);
    cardPin.value = "";
    if (!user) {
      print({ message: "Incorrect PIN, please try again" });
      return;
    }
    print({ message: "Welcome " + user.username + ", What would you like to do?" });
    updateState('options');
  }

  function erase() {
    if (state.state === 'auth') {
      if (cardPin.value.length > 0) {
        cardPin.value = cardPin.value.slice(0, -1);
        console.log(cardPin.value);
      }
    } else if (state.state === 'deposit' || state.state === 'withdraw') {
      if (amount.value.length > 0) {
        amount.value = amount.value.slice(0, -1);
        console.log(amount.value);
      }
    }
  }

  function print({ message }) {
    console.log(message);
    screenMessage.textContent = message;
  }

  function updateState(newState) {
    // states: auth, options, deposit, withdraw, balance
    state.state = newState;
  }

  function showBalance() {
    if (state.state !== 'options') return;

    console.log('checking balance...');
    const balance = atm.checkBalance();
    print({ message: `Your balance is $${balance}` });
    updateState('balance');
  }

  function back() {
    if (state.state === 'options' || state.state === 'auth') return;

    console.log('going back...');
    print({ message: "Welcome " + atm.authenticatedUser + ", What would you like to do?" });
    updateState('options');
  }

  function deposit() {
    if (state.state !== 'options') return;

    console.log('depositing...');
    print({ message: "Enter the amount to deposit" });
    updateState('deposit');
  }

  function withdraw() {
    if (state.state !== 'options') return;

    console.log('withdrawing...');
    print({ message: "Enter the amount to withdraw" });
    updateState('withdraw');
  }

  function okHandler() {
    if (state.state === 'auth') {
      authenticate();
      return;
    } else if (state.state === 'deposit') {
      const amountNumber = parseInt(amount.value)
      const balance = atm.deposit(amountNumber);
      if (!balance) {
        print({ message: "Error: Invalid amount" });
        amount.value = "";
        return;
      }
      print({ message: `Deposit $${amount.value} to ${atm.authenticatedUser}, Total: $${balance}` });
      amount.value = "";
      return;
    } else if (state.state === 'withdraw') {
      const amountNumber = parseInt(amount.value)
      const balance = atm.withdraw(amountNumber);
      if (!balance) {
        print({ message: "Error: Invalid amount" });
        amount.value = "";
        return;
      }
      print({ message: `Withdraw $${amount.value} to ${atm.authenticatedUser}, Total: $${balance}` });
      amount.value = "";
      return;
    } else if (state.state === 'balance') {
      back();
      return;
    }
  }



  // add event listeners
  numberPad.forEach((numberButton) => {
    numberButton.addEventListener("click", typePin);
  });

  okButton.addEventListener("click", okHandler);
  deleteButton.addEventListener("click", erase);
  checkButton.addEventListener("click", showBalance);
  depositButton.addEventListener("click", deposit);
  withdrawButton.addEventListener("click", withdraw);
  backButton.addEventListener("click", back);

  // init
  print({ message: "Welcome to ATM, please enter your PIN" });

  // atm.authentication('lisbeth cifuentes', 4321);
  // atm.deposit(390);
  // atm.withdraw(980);
  // atm.checkBalance();

  // atm.authentication('stiven trujillo', 1234);
  // atm.deposit(50);
  // atm.withdraw(100);
  // atm.checkBalance();

  // console.log(atm.users)
};

// init app
app();
