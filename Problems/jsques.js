//implement debounce function [Basic one]
function calling(...args) {
  console.log("Calling from Inside btn", args);
}

const outerDebounce = customdebounce(calling, 3000, false, false);

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
