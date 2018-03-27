// this wrapper cannot handle function with many results,
// cause promise can pass only one of them to resolve function
export default function wrap(func) {
  return function(...funcArgs) {
    return new Promise((resolve, reject) => {
      func(...funcArgs, (err, result) => {
        if (err) {
          return reject(err);
        }

        return resolve(result);
      });
    });
  };
}
