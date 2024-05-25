//Polyfills
//Promise.all() polyfill
/*
 Promise.all() accepts an array of promise as input and returns a promise which will resolve when all the promises in input are resolved or iterable does not contains any more, and will reject with the reason of the very first rejection. It always returns resolved promises in the order of promise passed
*/

const myPromiseAll = function (taskList) {
  const result = [];
  let trackSolved = 0;
  return new Promise((resolve, reject) => {
    taskList.forEach((task, index) => {
      task
        .then((val) => {
          result[index] = val;
          trackSolved++;
          if (trackSolved === taskList.length) {
            resolve(result);
          }
        })
        .catch((err) => {
          reject(err);
        });
    });
  });
};

//Promise.Any() Polyfill
/**
 * Promise.Any() accepts an array of Promises. It resolves as soon as any of the promise is fulfilled and if none of the promise fulfills then it will returns an array with rejection message of all promises. Its reverse of promise.all
 */

const myPromiseAny = function (taskList) {
  const res = [];
  let i = 0;
  return new Promise((resolve, reject) => {
    taskList.forEach((task) => {
      task
        .then((val) => {
          resolve(val);
        })
        .catch((err) => {
          res.push(err);
          i++;
          if (i === taskList.length) {
            reject(res);
          }
        });
    });
  });
};

//Promise.race() Polyfill
/**
 * Promise.race() accepts an array of promise and fulfills as soon as any promise reolves or rejects as soon as any promise rejects
 */

const myPromiseRace = function (taskList) {
  return new Promise((resolve, reject) => {
    taskList.forEach((task) => {
      task
        .then((val) => {
          resolve(val);
        })
        .catch((err) => {
          reject(err);
        });
    });
  });
};
