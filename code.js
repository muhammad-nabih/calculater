// تعريف المتغيرات العامة وتهيئتها
let operators = ["+", "-", "/", "*"]; // قائمة بالعمليات الحسابية الممكنة
let box = null; // مربع النص الرئيسي
let last_operation_history = null; // عنصر عرض تاريخ العمليات
let operator = null; // المشغل الحالي
let equal = null; // علامة اليساوي
let dot = null; // النقطة العشرية

let firstNum = true; // متغير يشير إلى ما إذا كان الرقم الأول

let numbers = []; // قائمة تحتوي على الأرقام
let operator_value; // قيمة المشغل
let last_button; // آخر زر تم الضغط عليه
let calc_operator; // المشغل المستخدم في الحساب

let total; // النتيجة الإجمالية

let key_combination = []; // قائمة تحتوي على تركيبة المفاتيح

// دالة تفعيل زر الرقم
function button_number(button) {
  // احضار العناصر من عناصر الصفحة
  operator = document.getElementsByClassName("operator");
  box = document.getElementById("box");
  last_operation_history = document.getElementById("last_operation_history");
  equal = document.getElementById("equal_sign").value;
  dot = document.getElementById("dot").value;

  last_button = button;

  // إذا كان الزر ليس مشغل أو علامة اليساوي
  if (!operators.includes(button) && button != equal) {
    // إذا كان هذا هو الزر الأول المضغوط
    if (firstNum) {
      // وإذا كان زر النقطة، عرض الرقم 0.
      if (button == dot) {
        box.innerText = "0" + dot;
      }
      // في حالة غير ذلك، مسح المربع وعرض الرقم
      else {
        box.innerText = button;
      }
      firstNum = false;
    } else {
      // إرجاع إذا كانت قيمة المربع 0
      if (box.innerText.length == 1 && box.innerText == 0) {
        if (button == dot) {
          box.innerText += button;
        }
        return;
      }
      // إرجاع إذا كان المربع يحتوي بالفعل على نقطة وتم النقر على نقطة
      if (box.innerText.includes(dot) && button == dot) {
        return;
      }
      // الحد الأقصى للأرقام المسموح بها هو 20
      if (box.innerText.length == 20) {
        return;
      }
      // إذا تم النقر على نقطة وكان المربع يحتوي بالفعل على علامة ناقصة، عرض -0.
      if (button == dot && box.innerText == "-") {
        box.innerText = "-0" + dot;
      }
      // في حالة أخرى، إلحاق الرقم
      else {
        box.innerText += button;
      }
    }
  }
  // إذا كان مشغلًا أو علامة اليساوي
  else {
    // إرجاع إذا تم الضغط بالفعل على المشغل
    if (operator_value != null && button == operator_value) {
      return;
    }

    // عرض علامة الناقص إذا كان القيمة الأولى محددة وأخيراً العودة
    if (button == "-" && box.innerText == 0) {
      box.innerText = button;
      firstNum = false;
      operator_value = button;
      showSelectedOperator();
      return;
    }
    // إرجاع إذا تم الضغط على العملية ناقص وكان المربع يحتوي بالفعل على -
    else if (operators.includes(button) && box.innerText == "-") {
      return;
    }
    // إرجاع إذا تم الضغط على العملية ناقص وكان تاريخ العملية بالفعل يحتوي على علامة اليساوي
    else if (
      button == "-" &&
      operator_value == "-" &&
      last_operation_history.innerText.includes("=")
    ) {
      return;
    }

    // تعيين قيمة المشغل إذا كان واحدًا
    if (operators.includes(button)) {
      if (typeof last_operator != "undefined" && last_operator != null) {
        calc_operator = last_operator;
      } else {
        calc_operator = button;
      }
      if (button == "*") {
        last_operator = "×";
      } else if (button == "/") {
        last_operator = "÷";
      } else {
        last_operator = button;
      }
      operator_value = button;
      firstNum = true;
      showSelectedOperator();
    }

    // إضافة الرقم الأول إلى قائمة الأرقام وعرضه في التاريخ
    if (numbers.length == 0) {
      numbers.push(box.innerText);
      if (typeof last_operator != "undefined" && last_operator != null) {
        last_operation_history.innerText = box.innerText + " " + last_operator;
      }
    }
    // الحسابات الباقية
    else {
      if (numbers.length == 1) {
        numbers[1] = box.innerText;
      }
      let temp_num = box.innerText;

      // حساب النتيجة الكلية
      if (button == equal && calc_operator != null) {
        let total = calculate(numbers[0], numbers[1], calc_operator);
        box.innerText = total;

        // إلحاق الرقم الثاني بالتاريخ
        if (!last_operation_history.innerText.includes("=")) {
          last_operation_history.innerText += " " + numbers[1] + " =";
        }

        temp_num = numbers[0];

        numbers[0] = total;
        operator_value = null;
        showSelectedOperator();

        // استبدال الرقم الأول من التاريخ بقيمة الإجمالي
        let history_arr = last_operation_history.innerText.split(" ");
        history_arr[0] = temp_num;
        last_operation_history.innerText = history_arr.join(" ");
      }
      // تحديث التاريخ بالقيمة على الشاشة والمشغل المضغوط
      else if (calc_operator != null) {
        last_operation_history.innerText = temp_num + " " + last_operator;
        calc_operator = button;
        numbers = [];
        numbers.push(box.innerText);
      }
    }
  }
}

// دالة لتظليل زر المشغل عند اختياره
function showSelectedOperator() {
  let elements = document.getElementsByClassName("operator");

  for (let i = 0; i < elements.length; i++) {
    elements[i].style.backgroundColor = "#e68a00";
  }

  if (operator_value == "+") {
    document.getElementById("plusOp").style.backgroundColor = "#ffd11a";
  } else if (operator_value == "-") {
    document.getElementById("subOp").style.backgroundColor = "#ffd11a";
  } else if (operator_value == "*") {
    document.getElementById("multiOp").style.backgroundColor = "#ffd11a";
  } else if (operator_value == "/") {
    document.getElementById("divOp").style.backgroundColor = "#ffd11a";
  }
}

// دالة لحساب النتيجة باستخدام رقمين ومشغل
function calculate(num1, num2, operator) {
  if (operator === "+") {
    total = parseFloat(num1) + parseFloat(num2);
  } else if (operator === "-") {
    total = parseFloat(num1) - parseFloat(num2);
  } else if (operator === "*") {
    total = parseFloat(num1) * parseFloat(num2);
  } else if (operator === "/") {
    total = parseFloat(num1) / parseFloat(num2);
  } else {
    if (total == box.innerText) {
      return total;
    } else {
      return box.innerText;
    }
  }
  // إذا كانت النتيجة ليست عددًا صحيحًا، عرض حتى 12 عشرة عشرية
  if (!Number.isInteger(total)) {
    total = total.toPrecision(12);
  }
  return parseFloat(total);
}

// دالة لمسح المربع وإعادة الضبط
function button_clear() {
  window.location.reload();
}

// دالة لإزالة آخر رقم أدخله المستخدم
function backspace_remove() {
  box = document.getElementById("box");
  let elements = document.getElementsByClassName("operator");

  for (let i = 0; i < elements.length; i++) {
    elements[i].style.backgroundColor = "#e68a00";
  }

  let last_num = box.innerText;
  last_num = last_num.slice(0, -1);

  box.innerText = last_num;

  // إذا تمت إزالة جميع الأحرف من الشاشة، عرض الرقم 0
  if (box.innerText.length == 0) {
    box.innerText = 0;
    firstNum = true;
  }
}

// دالة لتغيير علامة الرقم الحالي
function plus_minus() {
  box = document.getElementById("box");

  // إذا كان أي مشغل مضغوط بالفعل
  if (typeof last_operator != "undefined") {
    if (numbers.length > 0) {
      // إذا كان آخر زر تم الضغط عليه مشغل
      if (operators.includes(last_button)) {
        // إذا كان النص المعروض فقط علامة ناقصة، استبدلها بالرقم 0
        if (box.innerText == "-") {
          box.innerText = 0;
          firstNum = true;
          return;
        }
        // إذا كان النص المعروض ليس فقط علامة ناقصة، استبدلها بعلامة ناقصة
        else {
          box.innerText = "-";
          firstNum = false;
        }
      }
      // إذا لم يكن آخر زر تم الضغط عليه مشغل، غير علامة الرقم
      else {
        box.innerText = -box.innerText;

        if (numbers.length == 1) {
          numbers[0] = box.innerText;
        } else {
          numbers[1] = box.innerText;
        }
      }
    }
    return;
  }

  // إذا كان النص المعروض 0، استبدله بعلامة ناقصة
  if (box.innerText == 0) {
    box.innerText = "-";
    firstNum = false;
    return;
  }
  box.innerText = -box.innerText;
}

// دالة لحساب الجذر التربيعي للرقم الحالي على الشاشة
function square_root() {
  box = document.getElementById("box");
  let square_num = Math.sqrt(box.innerText);
  box.innerText = square_num;
  numbers.push(square_num);
}

// دالة لحساب قسمة 1 على الرقم الحالي على الشاشة
function division_one() {
  box = document.getElementById("box");
  let square_num = 1 / box.innerText;
  box.innerText = square_num;
  numbers.push(square_num);
}

// دالة لحساب قوة الرقم الحالي على الشاشة
function power_of() {
  box = document.getElementById("box");
  let square_num = Math.pow(box.innerText, 2);
  box.innerText = square_num;
  numbers.push(square_num);
}

// دالة لحساب النسبة المئوية لرقم
function calculate_percentage() {
  let elements = document.getElementsByClassName("operator");
  box = document.getElementById("box");

  if (numbers.length > 0 && typeof last_operator != "undefined") {
    let perc_value = (box.innerText / 100) * numbers[0];
    if (!Number.isInteger(perc_value)) {
      perc_value = perc_value.toFixed(2);
    }
    box.innerText = perc_value;
    numbers.push(box.innerText);

    // إلحاق الرقم الثاني بالتاريخ
    if (!last_operation_history.innerText.includes("=")) {
      last_operation_history.innerText += " " + numbers[1] + " =";
    }
  } else {
    box.innerText = box.innerText / 100;
  }

  numbers.push(box.innerText);
  let res = calculate(numbers[0], numbers[1], last_operator);
  box.innerText = res;
  operator_value = "=";

  // إلغاء تحديد المشغل إذا كان أحد محددًا
  for (let i = 0; i < elements.length; i++) {
    elements[i].style.backgroundColor = "#e68a00";
  }
}

// دالة لمسح الرقم الأخير المكتوب في الشاشة
function clear_entry() {
  box = document.getElementById("box");

  if (numbers.length > 0 && typeof last_operator != "undefined") {
    box.innerText = 0;
    let temp = numbers[0];
    numbers = [];
    numbers.push(temp);
    firstNum = true;
  }
}

// التقاط أحداث الضغط على المفاتيح
document.addEventListener("keydown", keyPressed);
document.addEventListener("keyup", keyReleased);

// دالة لمعالجة حدث الضغط على المفاتيح
function keyPressed(e) {
  e.preventDefault();
  let equal = document.getElementById("equal_sign").value;
  let dot = document.getElementById("dot").value;

  if (e.key == "Delete") {
    button_clear();
    return;
  }

  let isNumber = isFinite(e.key);
  let enterPress;
  let dotPress;
  let commaPress = false;

  if (e.key == "Enter") {
    enterPress = equal;
  }
  if (e.key == ".") {
    dotPress = dot;
  }
  if (e.key == ",") {
    commaPress = true;
  }

  if (
    isNumber ||
    operators.includes(e.key) ||
    e.key == "Enter" ||
    e.key == dotPress ||
    commaPress ||
    e.key == "Backspace"
  ) {
    if (e.key == "Enter") {
      button_number(enterPress);
    } else if (e.key == "Backspace") {
      document.getElementById("backspace_btn").style.backgroundColor =
        "#999999";
      backspace_remove();
    } else if (commaPress) {
      button_number(dot);
    } else {
      button_number(e.key);
    }
  }
  if (e.key) {
    key_combination[e.code] = e.key;
  }
}

// دالة لمعالجة حدث رفع المفتاح
function keyReleased(e) {
  if (key_combination["ControlLeft"] && key_combination["KeyV"]) {
    navigator.clipboard
      .readText()
      .then((text) => {
        box = document.getElementById("box");
        let isNumber = isFinite(text);
        if (isNumber) {
          let copy_number = text;
          firstNum = true;
          button_number(copy_number);
        }
      })
      .catch((err) => {
        console.error("Failed to read clipboard contents: ", err);
      });
  }
  if (key_combination["ControlLeft"] && key_combination["KeyC"]) {
    box = document.getElementById("box");
    navigator.clipboard.writeText(box.innerText);
  }
  key_combination = [];
  e.preventDefault();
  // إعادة لون زر المسح إلى اللون الأصلي
  if (e.key == "Backspace") {
    document.getElementById("backspace_btn").style.backgroundColor = "#666666";
  }
}
