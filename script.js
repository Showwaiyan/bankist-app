    'use strict';

    /////////////////////////////////////////////////
    /////////////////////////////////////////////////
    // BANKIST APP

    /////////////////////////////////////////////////
    // Data

    // DIFFERENT DATA! Contains movement dates, currency and locale

    const account1 = {
    owner: 'Jonas Schmedtmann',
    movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
    interestRate: 1.2, // %
    pin: 1111,

    movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-05-27T17:01:17.194Z',
    '2020-07-11T23:36:17.929Z',
    '2020-07-12T10:51:36.790Z',
    ],
    currency: 'EUR',
    locale: 'pt-PT', // de-DE
    };

    const account2 = {
    owner: 'Jessica Davis',
    movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
    interestRate: 1.5,
    pin: 2222,

    movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
    ],
    currency: 'USD',
    locale: 'en-US',
    };

    const accounts = [account1, account2];

    /////////////////////////////////////////////////
    // Elements
    const labelWelcome = document.querySelector('.welcome');
    const labelDate = document.querySelector('.date');
    const labelBalance = document.querySelector('.balance__value');
    const labelSumIn = document.querySelector('.summary__value--in');
    const labelSumOut = document.querySelector('.summary__value--out');
    const labelSumInterest = document.querySelector('.summary__value--interest');
    const labelTimer = document.querySelector('.timer');

    const containerApp = document.querySelector('.app');
    const containerMovements = document.querySelector('.movements');

    const btnLogin = document.querySelector('.login__btn');
    const btnTransfer = document.querySelector('.form__btn--transfer');
    const btnLoan = document.querySelector('.form__btn--loan');
    const btnClose = document.querySelector('.form__btn--close');
    const btnSort = document.querySelector('.btn--sort');

    const inputLoginUsername = document.querySelector('.login__input--user');
    const inputLoginPin = document.querySelector('.login__input--pin');
    const inputTransferTo = document.querySelector('.form__input--to');
    const inputTransferAmount = document.querySelector('.form__input--amount');
    const inputLoanAmount = document.querySelector('.form__input--loan-amount');
    const inputCloseUsername = document.querySelector('.form__input--user');
    const inputClosePin = document.querySelector('.form__input--pin');
    /////////////////////////////////////////////////
    // Functions

    const displayMovements = function (acc, sort = false) {
    containerMovements.innerHTML = '';

    // const movs = sort ? acc.movements.slice().sort((a, b) => a - b) : acc.movements;
    const combineMovesDates = acc.movements.map((mov,i)=>({
        movement: mov,
        date: acc.movementsDates.at(i)
    }));

    if (sort) combineMovesDates.sort((a,b)=>a.movement-b.movement)


    combineMovesDates.forEach(function (mov,i) {
    const type = mov.movement > 0 ? 'deposit' : 'withdrawal';
    const movDate = mov.date;



    const html = `
        <div class="movements__row">
        <div class="movements__type movements__type--${type}">${
        i + 1
    } ${type}</div>
        <div class="movements__date">${formatDate(new Date(movDate))}</div>
        <div class="movements__value">${formatAmount(acc,mov.movement)}</div>
        </div>
    `;

    containerMovements.insertAdjacentHTML('afterbegin', html);
    });
    };

    const calcDisplayBalance = function (acc) {
    acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
    labelBalance.textContent = formatAmount(acc,acc.balance);
    };

    const calcDisplaySummary = function (acc) {
    let sliceDecimal = function(value) {
        return value.toString().slice(0,value.toString().indexOf('.')+3)
    }

    const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
    labelSumIn.textContent = `${formatAmount(acc,incomes)}`;

    const out = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
    labelSumOut.textContent = `${formatAmount(acc,Math.abs(out))}`;

    const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter((int, i, arr) => {
        // console.log(arr);
        return int >= 1;
    })
    .reduce((acc, int) => acc + int, 0);
    labelSumInterest.textContent = `${formatAmount(acc,interest)}`;
    };

    const displayDate = function (date) {
    date ??= new Date();
    const day = date.getDate().toString().padStart(2,'0');
    const month = (date.getMonth()+1).toString().padStart(2, '0');
    const year = date.getFullYear();
    const hour = date.getHours().toString().padStart(2, '0');
    const min = date.getMinutes().toString().padStart(2, '0');

    return `${day}/${month}/${year} - ${hour}:${min}`;
    }

    const formatDate = (date) => {
        const dayPassed = Math.round(Math.abs((date - new Date()) / (1000*60*60*24)));
        if (dayPassed === 0) return "Today";
        else if (dayPassed === 1) return "Yesterday";
        else if (dayPassed <= 20) return `${dayPassed} days ago`;
        else {
            return new Intl.DateTimeFormat(currentAccount.locale).format(date);
        }
    }

    const formatAmount = (acc,amount) => {
    return new Intl.NumberFormat(acc.locale,{
        style: 'currency',
        currency: acc.currency,
        currencyDisplay: 'symbol',
        useGrouping: 'true',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(amount);
    }

    const createUsernames = function (accs) {
    accs.forEach(function (acc) {
    acc.username = acc.owner
        .toLowerCase()
        .split(' ')
        .map(name => name[0])
        .join('');
    });
    };
    createUsernames(accounts);

    // Update login timer
    const startLogoutTimer = function () {
        let duration = 300; // 300 seconds= 5 minutes
        const tick = () => {
            const sec = duration % 60;
            const min = Math.trunc(duration / 60);
            labelTimer.textContent = `${min}:${sec.toString().padStart(2,'0')}`;

            if (duration === 0) {
                clearInterval(timer);
                currentAccount = null;
                containerApp.style.opacity = 0;
                labelWelcome.textContent = "Log in to get started";
            }
            duration--;
        };
        tick();
        const timer = setInterval(tick, 1000);
        return timer;
    }

    const updateUI = function (acc) {
    // Display movements
    displayMovements(acc);

    // Display balance
    calcDisplayBalance(acc);

    // Display summary
    calcDisplaySummary(acc);

    // Display date
    const locale = currentAccount.locale;
    const option = {
    hour: 'numeric',
    minute: 'numeric',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    weekday: 'long'
    }
    labelDate.textContent = new Intl.DateTimeFormat(locale,option).format(new Date());
    };

    ///////////////////////////////////////
    // Event handlers
    let currentAccount, timer = null;

    // Fake Login
    // currentAccount = account1
    // updateUI(currentAccount)
    // containerApp.style.opacity = 100;

    const restartTimer = function() {
        if (timer) clearInterval(timer);
        timer = startLogoutTimer();
    }


    btnLogin.addEventListener('click', function (e) {
    // Prevent form from submitting
    e.preventDefault();

    currentAccount = accounts.find(
        acc => acc.username === inputLoginUsername.value.trim()
    );

    if (currentAccount?.pin === Number(inputLoginPin.value.trim())) {
        // Update login timer
        restartTimer()

        // Display UI and message
        labelWelcome.textContent = `Welcome back, ${
        currentAccount.owner.split(' ')[0]
        }`;
        containerApp.style.opacity = 100;

        // Clear input fields
        inputLoginUsername.value = inputLoginPin.value = '';
        inputLoginPin.blur();

        // Update UI
        updateUI(currentAccount);
    }
    });

    btnTransfer.addEventListener('click', function (e) {
    e.preventDefault();
    restartTimer();
    const amount = Number(inputTransferAmount.value);
    const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
    );
    inputTransferAmount.value = inputTransferTo.value = '';

    if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc?.username !== currentAccount.username
    ) {
    // Doing the transfer
    // amount
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);

    // date
    currentAccount.movementsDates.push(new Date().toISOString());
    receiverAcc.movementsDates.push(new Date().toISOString());

    // Update UI
    updateUI(currentAccount);
    }
    });

    btnLoan.addEventListener('click', function (e) {
    e.preventDefault();
    restartTimer();
    const amount = Number(inputLoanAmount.value);

    if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    setTimeout(function(){
    // Add movement
    currentAccount.movements.push(amount);
    currentAccount.movementsDates.push(new Date().toISOString())

    // Update UI
    updateUI(currentAccount);
    },5000)
    }
    inputLoanAmount.value = '';
    });

    btnClose.addEventListener('click', function (e) {
    e.preventDefault();

    if (
    inputCloseUsername.value === currentAccount.username &&
    Number(inputClosePin.value) === currentAccount.pin
    ) {
    const index = accounts.findIndex(
        acc => acc.username === currentAccount.username
    );
    console.log(index);
    // .indexOf(23)

    // Delete account
    accounts.splice(index, 1);

    // Hide UI
    containerApp.style.opacity = 0;
    }

    inputCloseUsername.value = inputClosePin.value = '';
    });

    let sorted = false;
    btnSort.addEventListener('click', function (e) {
    e.preventDefault();
    restartTimer();
    displayMovements(currentAccount, !sorted);
    sorted = !sorted;
    });

    /////////////////////////////////////////////////
    /////////////////////////////////////////////////
    // LECTURES
