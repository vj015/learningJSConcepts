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

//Test Case 1
function task(time) {
  return new Promise(function (resolve, reject) {
    setTimeout(function () {
      resolve(time);
    }, time);
  });
}
let taskList = [task(1000), task(5000), task(3000)];
//run promise.all
myPromiseAll(taskList)
  .then((results) => {
    console.log("got results", results);
  })
  .catch(console.error);
