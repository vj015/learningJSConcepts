//implement debounce function [Basic one]
function calling(...args) {
  console.log("Calling from Inside btn at", Date.now());
}

const outerDebounce = throttle(calling, 3000);

function debounce(fn, delay) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    const context = this;
    timer = setTimeout(() => {
      fn.apply(context, args);
    }, delay);
  };
}

//implement debounce function [Immediate flag at beginning and at end]
function customdebounce(fn, delay, leading, trailing) {
  let timer;
  return function (...args) {
    const context = this;
    let isleadingInvoked = false;
    if (timer) {
      clearTimeout(timer);
    }
    if (leading && !timer) {
      fn.apply(context, args);
      isleadingInvoked = true;
    }
    timer = setTimeout(() => {
      if (trailing && !isleadingInvoked) {
        fn.apply(context, args);
      }
      timer = null;
    }, delay);
  };
}

function throttle(fn, delay) {
  let timer;
  let lastran;
  return function (...args) {
    const context = this;
    if (!lastran) {
      fn.apply(context, args);
      lastran = Date.now();
    } else {
      clearTimeout(timer);
      timer = setTimeout(() => {
        if (Date.now() - lastran >= delay) {
          fn.apply(context, args);
          lastran = Date.now();
        }
      }, delay - (Date.now() - lastran));
    }
  };
}

//calculator.add(10).subtract(2).divide(2).multiply(5);
function calculator() {
  this.value = 0;
  this.add = (val) => {
    this.value += val;
    return this;
  };
  this.subtract = (val) => {
    this.value -= val;
    return this;
  };
  this.multiply = (val) => {
    this.value *= val;
    return this;
  };
  this.divide = (val) => {
    if (val === 0) {
      return this;
    }
    this.value /= val;
    return this;
  };
  this.print = () => {
    return this.value;
  };
}
let a = new calculator().add(10).subtract(2).divide(2).multiply(5).print();
console.log(a);
