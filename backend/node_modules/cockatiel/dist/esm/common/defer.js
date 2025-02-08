export const defer = () => {
    let resolve;
    let reject;
    const promise = new Promise((res, rej) => {
        resolve = res;
        reject = rej;
    });
    return { resolve: resolve, reject: reject, promise };
};
//# sourceMappingURL=defer.js.map