let a = 10, b=20;
function multiply(a, b) {
  return a * b;
}

let result = multiply(a, b);
console.log("This is File2.js");
console.log("Multiplication Result:", result);

//Adding another function
const findMax = (num1, num2,num3,num4) => {
  return Math.max(num1, num2, num3, num4);
}
console.log("Maximum Number:", findMax(5, 10, 15, -1));

//create a function to sum all input values:
const sumAll = (...numbers) => {
  return numbers.reduce((acc, curr) => acc + curr, 0);
}
console.log("Sum of all numbers:", sumAll(1, 2, 3, 4, 100));