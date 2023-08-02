const display = document.querySelector(".display");
const buttons = document.querySelectorAll("button");
const clear = document.querySelector(".clear");

let firstNum = "";
let operator = "";
let secondNum = "";
let tempNum = "";
let tempSign = "";

function add(x, y) {
  return x + y;
}

function subtract(x, y) {
  return x - y;
}

function multiply(x, y) {
  return x * y;
}

function divide(x, y) {
  if (y === 0) {
    return "why:(";
  } else return x / y;
}

function percent(x, y) {
  if (Number.isNaN(y)) return x / 100;
  else return x * (y / 100);
}

function operate(firstNum, operator, secondNum) {
  let result;
  switch (operator) {
    case "+":
      result = add(firstNum, secondNum);
      break;
    case "-":
      result = subtract(firstNum, secondNum);
      break;
    case "*":
      result = multiply(firstNum, secondNum);
      break;
    case "/":
      result = divide(firstNum, secondNum);
      break;
    case "%":
      result = percent(firstNum, secondNum);
      break;
    default:
      result = "uh oh";
  }
  if (!Number(result)) {
    display.innerText = result;
    return firstNum;
  }
  if (Number.isInteger(result) && result < 10 ** 9) {
    display.innerText = result;
  } else if (result >= 10 ** 9) {
    display.innerText = result.toExponential(3);
  } else {
    display.innerText = result.toFixed(3);
  }
  return result;
}

buttons.forEach((button) => {
  button.addEventListener("click", (e) => {
    e.target.classList.add("clicked");
    let value = e.target.innerText;
    let isOperator = validOperator(value);
    if (value != "AC") {
      clear.innerText = "C";
    }
    //handle user = call
    if (value === "=") {
      //used when user only specifies a single operand and an operator
      //ex. user input of 6+= is equivalent to firstNum += 6
      if (operator !== "" && secondNum === "") {
        firstNum = operate(+firstNum, operator, +tempNum);
      } else if (secondNum === "") {
        //the user is just hitting enter with one operand
        display.innerText = firstNum;
      } else {
        //regular use case. two operands and an operator
        firstNum = operate(+firstNum, operator, +secondNum);
        operator = "";
        secondNum = "";
      }
    } else if (value === "+/-" && secondNum === "") {
      //allows user to toggle sign of the first num after selecting an operator
      firstNum = consumeNumber(firstNum, value);
    } else if (value === "%") {
      if (secondNum === "") {
        //find firstnum/100
        firstNum = operate(+firstNum, value, NaN);
      } else {
        secondNum = operate(+firstNum, value, +secondNum); //find secondnum percent of firstnum
      }
    } else if (tempSign === "+" || tempSign === "-") {
      //used if user is chaining operators. if we encounter one with higher precedence must put old expression on hold
      if (isOperator && (value === "+" || value === "-")) {
        //user was going to do multiplication/division but changed their mind.  perform old operation and point to the new + or -
        firstNum = operate(+temp, tempSign, firstNum);
        operator = value; //
        secondNum = "";
        tempSign = "";
        temp = "";
        return;
      } else if (isOperator && operator !== value) {
        //user changed operator of similar precedence. ex: mul --> div
        operator = value;
        return;
      }
      firstNum = operate(+firstNum, operator, +value); //perform new operation
      operator = tempSign; //begin to restore  the old one
      secondNum = firstNum;
      firstNum = temp;
      temp = "";
      tempSign = "";
    } else if (!isOperator && operator === "") {
      //if there is no operator and current input isn't an operator, must be generating first num
      if (tempNum != firstNum) {
        //firstNum will usually hold rseult of chained operations.
        firstNum = ""; //needs this to reset firstNum if user is starting a brand new expression
      }
      firstNum = consumeNumber(firstNum, value);
      tempNum = firstNum;
    } else if (!isOperator && operator !== "") {
      //if there is an operator and the current input isn't an operator, mmust be generating second num
      secondNum = consumeNumber(secondNum, value);
    } else if (isOperator && firstNum !== "" && secondNum !== "") {
      //used to handle chaining of operators.
      if (
        //if the user chained an operator of a higher precedence, we must perform that first.
        (operator === "+" || operator === "-") &&
        (value === "*" || value === "/")
      ) {
        temp = firstNum; //store old expression in temps
        firstNum = secondNum;
        secondNum = "";
        tempSign = operator;
        operator = value;
        return;
      }
      firstNum = operate(+firstNum, operator, +secondNum); //otherwise compute expression
      operator = value; //update operator
      secondNum = ""; //and get ready for next input
    } else if (isOperator && (operator === "" || secondNum == "")) {
      //if the user is spamming operators, update the current one
      operator = value;
    }
  });

  button.addEventListener("transitionend", (e) => {
    e.target.classList.remove("clicked");
  });
});

function consumeNumber(num, e) {
  num = String(num);
  if (!Number.isNaN(Number(e))) {
    if (num.includes(".")) {
      num = String(num + e);
    } else {
      num = String(Number(num + e));
    }
  } else if (e === "." && !num.includes(".")) {
    num = String(num + ".");
  } else if (e === "+/-") {
    if (Number(num)) {
      num = num.startsWith("-") ? num.replace("-", "") : "-" + num;
    } else {
      num = "0";
    }
  } else if (e === "C") {
    num = "0";
    clear.innerText = "AC";
  } else if (e === "AC") {
    firstNum = "";
    operator = "";
    secondNum = "";
    num = "";
    display.innerText = "0";

    return num;
  }
  if (num.length > 12) {
    display.innerText = Number(num).toExponential(3);
  } else {
    display.innerText = num;
  }
  return num;
}

function validOperator(oper) {
  switch (oper) {
    case "+":
      return true;
    case "-":
      return true;
    case "*":
      return true;
    case "/":
      return true;
    case "+/=":
      return true;
    case "%":
      return true;
    default:
      return false;
  }
}

document.addEventListener("keydown", (e) => {
  buttons.forEach((button) => {
    if (button.getAttribute("data-key") === e.key) {
      button.click();
    }
  });
});
