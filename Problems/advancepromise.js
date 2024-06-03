/**
 * Implement a mapSeries async function in JavaScript that is similar to the Array.map() but returns a promise that resolves on the list of output by mapping each input through an asynchronous iteratee function or rejects it if any error occurs. The inputs are run in a sequence that is one after another.The asynchronous iteratee function will accept an input and a callback. The callback function will be called when the input is finished processing, the first argument of the callback will be the error flag and the second will be the result.
 */
const mapSeries = (arr, fn) => {
  return new Promise((resolve, reject) => {
    const mapper = arr.reduce((prev, curr) => {
      return prev.then((val) => {
        return new Promise((resolve, reject) => {
          fn(curr, (error, success) => {
            if (error) {
              reject(error);
            } else {
              resolve([...val, success]);
            }
          });
        });
      });
    }, Promise.resolve([]));
    mapper
      .then((val) => {
        resolve(val);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

/**
 * Implement a mapLimit function that is similar to the Array.map() which returns a promise that resolves on the list of output by mapping each input through an asynchronous iteratee function or rejects it if any error occurs. It also accepts a limit to decide how many operations can occur at a time.The asynchronous iteratee function will accept a input and a callback. The callback function will be called when the input is finished processing, the first argument of the callback will be the error flag and the second will be the result.
 */

Array.prototype.chop = function (size) {
  const temp = [...this];
  const output = [];
  if (!size) {
    return temp;
  }
  if (size >= temp.length) {
    return temp;
  }
  let i = 0;
  while (i < temp.length) {
    output.push(temp.slice(i, i + size));
    i = i + size;
  }
  return output;
};
const mapLimit = (arr, size, fn) => {
  return new Promise((resolve, reject) => {
    const chopped = arr.chop(size);
    const mapper = chopped.reduce((prev, curr) => {
      return prev.then((val) => {
        const result = [];
        let completed = 0;
        return new Promise((resolve, reject) => {
          curr.forEach((element) => {
            fn(element, (error, success) => {
              if (error) {
                reject(error);
              } else {
                result.push(success);
                completed++;
                if (completed >= curr.length) {
                  resolve([...val, result]);
                }
              }
            });
          });
        });
      });
    }, Promise.resolve([]));
    mapper
      .then((val) => {
        resolve(val);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

/**
 * Implement a function that takes an array of input and an async iteratee function and returns a promise that resolves with the list of inputs that has passed the test through iteratee function in JavaScript.The inputs will run in parallel, but the output will be in the same order as the original.The asynchronous iteratee function will accept an input and a callback. The callback function will be called when the input is finished processing, the first argument of the callback will be the error flag and the second will be the result.
 */

const asyncfilter = (arr, fn) => {
  return new Promise((resolve, reject) => {
    const output = [];
    let completed = 0;
    arr.forEach((element, index) => {
      fn(element, (error, success) => {
        if (error) {
          reject(error);
        }
        completed++;
        if (success) {
          output[index] = element;
        }
        if (completed >= arr.length) {
          resolve(output.filter(Boolean));
        }
      });
    });
  });
};

/**
 * Implement a function that takes an array of input and an async iteratee function and returns a promise that resolves with the list of inputs that has failed the test through iteratee function in JavaScript. This function is exactly the opposite of the Async Filter.The inputs will run in parallel, but the output will be in the same order as the original.The asynchronous iteratee function will accept an input and a callback. The callback function will be called when the input is finished processing, the first argument of the callback will be the error flag and the second will be the result.
 */

const asyncReject = (arr, fn) => {
  return new Promise((resolve, reject) => {
    const output = [];
    let completed = 0;
    arr.forEach((element, index) => {
      fn(element, (error, success) => {
        if (error) {
          reject(error);
        }
        completed++;
        if (!success) {
          output[index] = element;
        }
        if (completed >= arr.length) {
          resolve(output.filter(Boolean));
        }
      });
    });
  });
};

//Execute promises with a priority: A sort of priority queue for resolving promises
/**
 * const promises = [
 {status: 'resolve', priority: 4},
 {status: 'reject', priority: 1},
 {status: 'resolve', priority: 2},
 {status: 'reject', priority: 3}
];
 */
const executeWithPriority = (promises) => {
  if (!promises || !promises.length) {
    return Promise.reject("No promise provided");
  }
  const output = Array(promises.length).fill(null);
  return new Promise((resolve, reject) => {
    const checkStatus = () => {
      for (let i = 0; i < output.length; i++) {
        if (output[i] === null) {
          return;
        }
        if (output[i].status === "fulfilled") {
          resolve(output[i].value);
        }
      }
      reject(output);
    };
    promises.forEach((promise, index) => {
      Promise.resolve(promise)
        .then((val) => {
          output[index] = {
            value: val,
            status: "fulfilled",
          };
        })
        .catch((err) => {
          output[index] = {
            status: "Rejected",
            error: err,
          };
        })
        .finally(() => {
          checkStatus();
        });
    });
  });
};

//create a pausable autoincreamenter
const pausableAutoIncreamenter = (init = 0, steps = 1000) => {
  let count = init;
  let intervalId = null;
  const startInterval = () => {
    if (intervalId === null) {
      intervalId = setInterval(() => {
        console.log(count);
        count += steps;
      }, 1000);
    }
  };
  const stopInterval = () => {
    clearInterval(intervalId);
    intervalId = null;
  };
  return {
    startInterval,
    stopInterval,
  };
};
let obj = pausableAutoIncreamenter();
obj.startInterval();
setTimeout(() => {
  obj.stopInterval();
}, 5000);
setTimeout(() => {
  obj.startInterval();
}, 7000);
