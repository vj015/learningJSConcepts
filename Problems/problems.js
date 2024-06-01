//Execute async functions in Series
const executeInSeries = async (promises) => {
  for (const p of promises) {
    try {
      let res = await p;
      console.log(res);
    } catch (error) {
      console.log(error);
    }
  }
};

const executeInParallel = (promises, cb) => {
  const success = [];
  const errors = [];
  let completed = 0;
  promises.forEach((p) => {
    p.then((val) => {
      success.push(val);
    })
      .catch((err) => {
        errors.push(err);
      })
      .finally(() => {
        completed++;
        if (completed >= promises.length) {
          cb(errors, success);
        }
      });
  });
};
