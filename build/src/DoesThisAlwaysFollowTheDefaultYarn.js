"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var util_1 = require("util");
promiseMe("a visit");
promiseMeFs("your undying love");
promiseMe("your firstborn child");
console.log("End of file");
function promiseMe(something) {
    return new Promise(function (resolve) {
        console.log(something);
        resolve();
    });
}
function promiseMeFs(something) {
    return util_1.promisify(fs.access)(".").then(function (whatever) {
        console.log(something);
    });
}
//# sourceMappingURL=DoesThisAlwaysFollowTheDefaultYarn.js.map