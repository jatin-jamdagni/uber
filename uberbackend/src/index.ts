import http from "http"
import app from "./app";
import { initializeSocket } from "./socket";


const port = parseInt(process.env.PORT || '3000');

const server = http.createServer(app);
initializeSocket(server);

server.listen(port, () => {
    console.log(`App is started at port http://localhost:${port}`)
});