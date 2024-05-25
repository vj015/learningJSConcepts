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
// Promise.finally() Polyfill
Promise.prototype.myfinally = function (cb) {
  const p = this.constructor || Promise;
  return p.then(
    (val) => {
      Promise.resolve(cb).then(() => val);
    },
    (err) => {
      Promise.resolve(cb).then(() => {
        throw err;
      });
    }
  );
};

//Promise.allSettled()
/**
 * Promise.allSettled() returns a promise which will resolve with outcome of all promises passed in input promise array
 */
const myPromiseAllSettled = function (taskList) {
  const res = [];
  let idx = 0;
  return new Promise((resolve) => {
    taskList.forEach((task, index) => {
      task
        .then((val) => {
          res[index] = { status: "fulfilled", value: val };
          idx++;
        })
        .catch((err) => {
          res[index] = { status: "rejected", reason: err };
          idx++;
        })
        .finally(() => {
          if (idx === taskList.length) {
            resolve(res);
          }
        });
    });
  });
};
