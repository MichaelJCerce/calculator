const display = document.querySelector(".display");
const buttons = document.querySelectorAll("button");

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
  console.log(operator);
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
      console.log("huh");
  }

  if (String(result).length > 9) {
    display.innerText = result.toExponential(2);
  } else {
    display.innerText = result;
  }

  if (!Number(result)) {
    return firstNum;
  } else return result;
}

buttons.forEach((button) => {
  button.addEventListener("click", (e) => {
    e.target.classList.add("clicked");
    let value = e.target.innerText;
    let isOperator = validOperator(value);

    if (value === "=") {
      if (operator !== "" && secondNum === "") {
        firstNum = operate(+firstNum, operator, +tempNum);
      } else if (secondNum === "") {
        display.innerText = firstNum;
      } else {
        firstNum = operate(+firstNum, operator, +secondNum);
        operator = "";
        secondNum = "";
      }
    } else if (value === "+/-" && secondNum === "") {
      firstNum = consumeNum(firstNum, value);
    } else if (!isOperator && operator === "") {
      if (tempNum != firstNum) {
        firstNum = "";
      }
      firstNum = consumeNum(firstNum, value);
      tempNum = firstNum;
    } else if (tempSign === "+" || tempSign === "-") {
      firstNum = operate(+firstNum, operator, +value);
      operator = tempSign;
      secondNum = firstNum;
      firstNum = temp;
      temp = "";
      tempSign = "";
    } else if (!isOperator && operator !== "") {
      secondNum = consumeNum(secondNum, value);
    } else if (value === "%") {
      if (secondNum === "") {
        firstNum = operate(+firstNum, value, NaN);
      } else {
        secondNum = operate(+firstNum, value, +secondNum);
      }
    } else if (isOperator && firstNum !== "" && secondNum !== "") {
      if (
        (operator === "+" || operator === "-") &&
        (value === "*" || value === "/")
      ) {
        temp = firstNum;
        firstNum = secondNum;
        secondNum = "";
        tempSign = operator;
        operator = value;
        return;
      }
      firstNum = operate(+firstNum, operator, +secondNum);
      operator = value;
      secondNum = "";
    } else if (isOperator && (operator === "" || secondNum == "")) {
      operator = value;
    }
  });

  button.addEventListener("transitionend", (e) => {
    e.target.classList.remove("clicked");
  });
});

function consumeNum(num, e) {
  num = String(num);
  if (!Number.isNaN(Number(e))) {
    num = String(Number(num + e));
  } else if (e === "." && !num.includes(".")) {
    num = String(num + ".");
  } else if (e === "+/-") {
    if (Number(num)) {
      num = num.startsWith("-") ? num.replace("-", "") : "-" + num;
    } else {
      num = "0";
    }
  } else if (e === "AC") {
    if (Number(num)) {
      num = "0";
    } else {
      firstNum = "";
      operator = "";
      secondNum = "";
      num = "";
      display.innerText = "0";
      return num;
    }
  }
  if (num.length > 9) {
    display.innerText = num.toExponential(2);
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
