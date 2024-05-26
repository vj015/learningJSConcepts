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
