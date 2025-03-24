// Utility to make a sync function async
const makeAsync = (fn) => (...args) => {
    return new Promise((resolve, reject) => {
        try {
            const result = fn(...args); // Call the synchronous function
            resolve(result);           // Resolve with the result
        } catch (error) {
            reject(error);             // Reject with the error
        }
    });
};

export default makeAsync;
