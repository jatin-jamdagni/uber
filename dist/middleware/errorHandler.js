"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const errorHandler = async (err, req, res) => {
    console.error(err.stack);
    return res.status(500).send('Something broke!');
};
exports.errorHandler = errorHandler;
