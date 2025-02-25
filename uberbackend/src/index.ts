import http from "http"
import app from "./app";


const port = parseInt(process.env.PORT || '3000');

const server = http.createServer(app);


server.listen(port, () => {
    console.log(`App is started at port http://localhost:${port}`)
});