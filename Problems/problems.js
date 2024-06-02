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

//AutoRetry a network call n number of times with a certain delay
/** Using then catch */
const wait = (ms) =>
  new Promise((resolve) => {
    console.log("Waiting");
    setTimeout(() => resolve(), ms);
  });

function autoRetryOnFail(fetcher, maxRetries) {
  return new Promise((resolve, reject) => {
    let retries = 0;
    const caller = () =>
      fetcher()
        .then((res) => {
          resolve(res);
        })
        .catch(() => {
          if (retries < maxRetries) {
            retries++;
            wait(1000).then(() => {
              caller();
            });
          } else {
            reject("Retries exhausted");
          }
        });
    retries = 1;
    caller();
  });
}

/**Using async await */
async function autoRetryOnFail1(fetcher, maxRetries, maxDelay) {
  try {
    let data = await fetcher();
    return data;
  } catch (error) {
    if (maxRetries <= 0) {
      return Promise.reject("Max Retries Exceeded");
    } else {
      await wait(maxDelay);
      await autoRetryOnFail1(fetcher, maxRetries - 1, maxDelay);
    }
  }
}

fetchGithubProfile = async () => {
  console.log("Fetching.....");
  let res = await fetch("https://api.githhub.com/users/vj015");
  let jsonValue = await res.json();
  return jsonValue;
};
autoRetryOnFail(fetchGithubProfile, 5)
  .then((res) => {
    console.log("Fetched Success", res);
  })
  .catch((err) => {
    console.log("Fetched err", err);
  });
autoRetryOnFail1(fetchGithubProfile, 5, 1000)
  .then((res) => {
    console.log("Fetched Success", res);
  })
  .catch((err) => {
    console.log("Fetched err", err);
  });
