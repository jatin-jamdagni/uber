"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = __importDefault(require("http"));
const app_1 = __importDefault(require("./app"));
const port = parseInt(process.env.PORT || '3000');
const server = http_1.default.createServer(app_1.default);
server.listen(port, () => {
    console.log(`App is started at port http://localhost:${port}`);
});
