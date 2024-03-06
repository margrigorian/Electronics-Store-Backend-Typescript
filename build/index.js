import express from "express";
import cors from "cors";
const app = express();
const PORT = 3001;
app.use(cors());
app.use(express.json());
app.get("/", (req, res) => {
    res.send("HELLO");
});
app.listen(PORT, () => {
    console.log(`Server has started on PORT ${PORT}`);
});
const arr = [1, 2, 3];
console.log(arr);
//# sourceMappingURL=index.js.map