//Execute async functions in Series  Method 1
const executeInSeries1 = async (promises, cb) => {
  const success = [];
  const errors = [];
  for (const p of promises) {
    try {
      let res = await p;
      success.push(res);
    } catch (error) {
      errors.push(error);
    }
  }
  cb(errors, success);
};

//Execute async functions in Series  Method 2
const executeInSeries2 = (promises, cb) => {
  const success = [];
  const errors = [];
  let completed = 0;
  promises.reduce((prev, curr) => {
    prev.finally(() => {
      curr
        .then((val) => {
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
  }, Promise.resolve());
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
