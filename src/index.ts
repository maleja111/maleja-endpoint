import express, {Request, Response } from 'express';

const app = express();
const port = "3000";

app.get('/', (req: Request, res: Response) => {
    console.log("👉👉👉👉 Endpoint working");
    res.send("👉👉👉👉 Endpoint working");

})

app.listen(port, ()=> {
    console.log("👨‍💻 Server is working!");
});