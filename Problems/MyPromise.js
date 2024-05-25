//Custom implementation of Promise
const STATE = {
  FULFILLED: "fulfilled",
  REJECTED: "rejected",
  PENDING: "pending",
};
class MyPromise {
  state = STATE.PENDING;
  value = undefined;
  #successCallbacks = [];
  #catchCallbacks = [];
  #onSuccessBind = this.#onSuccess.bind(this);
  #onFailureBind = this.#onFailure.bind(this);

  constructor(cb) {
    try {
      cb(this.#onSuccessBind, this.#onFailureBind);
    } catch (error) {
      this.#onFailure(error);
    }
  }
  #runCallbacks() {
    if (this.state === STATE.FULFILLED) {
      this.#successCallbacks.forEach((cb) => {
        cb(this.value);
      });
      this.#successCallbacks = [];
    }
    if (this.state === STATE.REJECTED) {
      this.#catchCallbacks.forEach((cb) => {
        cb(this.value);
      });
      this.#catchCallbacks = [];
    }
  }
  #onSuccess(val) {
    queueMicrotask(() => {
      if (this.state !== STATE.PENDING) {
        return;
      }
      if (val instanceof MyPromise) {
        val.then(this.#onSuccessBind, this.#onFailureBind);
        return;
      }
      this.value = val;
      this.state = STATE.FULFILLED;
      this.#runCallbacks();
    });
  }
  #onFailure(val) {
    queueMicrotask(() => {
      if (this.state !== STATE.PENDING) {
        return;
      }
      if (val instanceof MyPromise) {
        val.then(this.#onSuccessBind, this.#onFailureBind);
        return;
      }
      this.value = val;
      this.state = STATE.REJECTED;
      this.#runCallbacks();
    });
  }
  then(cb1, cb2) {
    return new MyPromise((resolve, reject) => {
      this.#successCallbacks.push((result) => {
        if (cb1 == null) {
          resolve(result);
          return;
        }
        try {
          resolve(cb1(result));
        } catch (error) {
          reject(error);
        }
      });
      this.#catchCallbacks.push((result) => {
        if (cb2 == null) {
          reject(result);
          return;
        }
        try {
          resolve(cb2(result));
        } catch (error) {
          reject(error);
        }
      });
      this.#runCallbacks();
    });
  }
  catch(cb) {
    return this.then(null, cb);
  }
  finally(cb) {
    this.then(
      (val) => {
        MyPromise.resolve(cb).then(() => val);
        return;
      },
      (err) => {
        MyPromise.resolve(cb).then(() => {
          throw err;
        });
      }
    );
  }
  static resolve(val) {
    return new MyPromise((resolve) => {
      resolve(val);
    });
  }
  static reject(val) {
    return new MyPromise((resolve, reject) => {
      reject(val);
    });
  }
}
module.exports = MyPromise;

const promise = new MyPromise((resolve, reject) => {
  setTimeout(() => {
    resolve("hello");
  }, 1000);
});
promise.then((value) => {
  console.log(value);
});
