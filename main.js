// состояние калькутора— все ли происходит правильно
let calculatorState = "ok";
// переменная для хранения значения в памяти
let memoryStoredValue = 0;
// первый операнд для вычислений
let firstOperand = "";
// текущий оператор
let currentOperator = "";
// ожидается ввод операнда- состояние
let operandExpected = false;
// операнд введен — состояние
let operandInputed = false;
// получаем массив кнопок
let buttons = Array.from(document.getElementsByTagName("button"));
// для каждой кнопки запускаем функцию выпоняем функцию ргосеззвиттоп
buttons.forEach((btn) =>
  btn.addEventListener("click", (e) => processButton(e.target.id))
);
// функция удаления лишних нулей
function cleanNumberStr(numStr) {
  if (numStr == "0" || numStr == "-0" || numStr == "0.") {
    return "0";
  }
  // возвращаем преобразованную строку
  return numStr;
}
// функция проверки, что была нажата кнопка числа
function isNumber(value) {
  return value.length == 1 && "0" <= value && value <= "9";
}
// главная функция обработки нажатия кнопки
function processButton(value) {
  // проверяем состояние калькулятора если оно в ошибке
  if (calculatorState == "err") {
    // если введено число
    if (isNumber(value)) {
      // выполняем функцию сброса
      clear();
    } else if (value != "ca") {
      // для всех кнопок кроме са ничего не делаем
      return;
    }
  }
  // получаем элемент поля ввода— вывода
  let box = document.getElementById("boxV");
  let boxM = document.getElementById("boxM");
  let boxValue = box.innerText;
  // если введено число либо часть будущего числа
  if (isNumber(value)) {
    // убираем ноль если он введен перед цифрой
    if (boxValue == "0" || boxValue == "-0") {
      boxValue = boxValue.slice(0, -1);
    }
    // случаи когда операнд ожидается истина
    // если число уже вводится условие не срабатывает
    // 1. когда была введена операция и нужно второе число
    // 2. когда нажали равно
    // З. ввод первого операнда для операции- в начале работы- операнд 0
    if (operandExpected) {
      // если операнд начинает вводится— меняем состояния
      // бокс очищаем так как ожидаем новый операнд
      boxValue = "";
      operandExpected = false;
      // пользователь начал вводить операнд состояние поменялось
      operandInputed = true;
    }
    // в бокс записываем цифру
    boxValue += value;
  }

  // если введена операция
  if (["+", "-", "*", "/"].includes(value)) {
    // если есть два операнда
    if (firstOperand != "" && operandInputed) {
      // в операнд записываем второй операнд
      const operand = cleanNumberStr(boxValue);
      // в бокс записывает результат вычисления и запоминаем состояние
      [boxValue, calculatorState] = calculate(
        firstOperand,
        operand,
        currentOperator
      );
      // меняем состояние
      operandInputed = false;
    }
    // записываем значение из бокса в первый операнд
    firstOperand = cleanNumberStr(boxValue);
    // ожидаем ввод нового операнда— так как операция
    operandExpected = true;
    // запоминаем текущую операцию
    currentOperator = value;
  }

  // переменная для вычислений
  let operand = "";
  // основной выбор действий
  switch (value) {
    case "=":
      // если у нас не хваатет данных выходим
      if (operandExpected || firstOperand == "" || currentOperator == "") {
        //|| secondOperand == ""
        return;
      }
      // создаем операнд для последнего введного числа записываем число в нее
      let secondOperand = cleanNumberStr(boxValue);
      // вычисляем
      [boxValue, calculatorState] = calculate(
        firstOperand,
        secondOperand,
        currentOperator
      );
      // меняем состояния
      operandInputed = false;
      operandExpected = true;
      // обнуляем операнды
      firstOperand = "";
      currentOperator = "";
      break;
    case ".":
      // проверяем есть ли уже точкит в боксе
      if (boxValue.indexOf(".") >= 0) {
        // dot already exists
        return;
      }
      // добавляем точку
      boxValue += ".";
      break;
    case "changeSign":
      //
      if (boxValue.startsWith("-")) {
        boxValue = boxValue.slice(1);
      } else {
        boxValue = "-" + boxValue;
      }
      break;
    case "sqrt":
      // корень из числа
      operand = cleanNumberStr(boxValue);
      // если минус ошибка
      if (operand.startsWith("-")) {
        calculatorState = "err";
      } else {
        // используем библиотеку мат для вычисления корня
        boxValue = Math.sqrt(parseFloat(operand)).toString();
      }
      break;
    case "1divx":
      // делим на число
      operand = cleanNumberStr(boxValue);
      if (operand == "0") {
        calculatorState = "err";
      } else {
        boxValue = (1.0 / parseFloat(operand)).toString();
      }
      break;
    case "pow":
      // квадрат
      operand = cleanNumberStr(boxValue);
      boxValue = Math.pow(parseFloat(operand), 2);
      break;
    case "%":
      operand = cleanNumberStr(boxValue);
      boxValue = (parseFloat(operand) / 100.0).toString();
      break;
    case "mr":
      // ставим в бокс значение из памяти
      boxValue = memoryStoredValue.toString();
      // если операнд ожидался говорим что веден
      if (operandExpected) {
        operandInputed = true;
        operandExpected = false;
      } else {
        operandInputed = false;
        operandExpected = true;
      }
      break;
    case "m+":
      // плюсуем к памяти
      operand = parseFloat(cleanNumberStr(boxValue));
      memoryStoredValue += operand;
      operandExpected = true;
      break;
    case "m-":
      operand = parseFloat(cleanNumberStr(boxValue));
      memoryStoredValue -= operand;
      operandExpected = true;
      break;
    case "mc":
      // обнуляем память
      memoryStoredValue = 0;
      break;
    case "remove":
      // удаляем последний элемент числа, на операцию не влияет
      let removed = boxValue.slice(0, -1);
      // если после удаления осталось число то в бокс если нет ноль
      boxValue = removed.length > 0 ? removed : "0";
      break;
    case "ce":
      // очищает поле ввода
      boxValue = "0";
      break;
    case "ca":
      // очищает все кроме регистра памяти
      clear();
      return;
  }

  // если состояние ошибки выводим ошибку
  if (calculatorState == "err") {
    boxValue = "Error";
  }
  // выводим в бокс
  box.innerText = boxValue;
  boxM.innerText = memoryStoredValue;
}
// функция для выполнения арифметических операций
// функция будет возвращать результат и состояние -есть ошибка или нет
function calculate(first0perand, secondOperandStr, operator) {
  // преобразуем строки в число
  const num1 = parseFloat(firstOperand);
  const num2 = parseFloat(secondOperandStr);
  // переменная для результата
  let total = 0;
  // в зависимости от операции
  switch (
    operator ////opeartor
  ) {
    case "+":
      total = num1 + num2;
      break;
    case "-":
      total = num1 - num2;
      break;
    case "*":
      total = num1 * num2;
      break;
    case "/":
      // делить на ноль нельзя выдаем ошибку
      if (num2 == 0) {
        return ["", "err"];
      }
      total = num1 / num2;
      break;
  }
  // во всех случаях кроме деления на ноль выдаем результат и состояние ок
  return [total.toString(), "ok"];
}
// функция очистки поля ввода/вывода
function clear() {
  // состояние ок
  calculatorState = "ok";
  // очищаем значения операторов
  firstOperand = "";
  currentOperator = "";
  // в боксе будет нолик
  document.getElementById("box").innerText = "0";
  // состояния ожидания операторов в значениях фолс
  operandInputed = false;
  operandExpected = false;
}
