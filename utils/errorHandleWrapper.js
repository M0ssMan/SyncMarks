export function errorHandleWrapper(promiseFunc, ...args) {
  return promiseFunc(...args)
    .catch(err => {
      console.error(err);
      throw err;
    });
}
