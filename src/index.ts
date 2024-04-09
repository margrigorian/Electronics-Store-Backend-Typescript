import express, { Application } from "express";
import cors from "cors";
import path from "path";
import authRouter from "./routing/authRouter.js";
import catalogRouter from "./routing/catalogRouter.js";
import adminRouter from "./routing/adminRouter.js";
import userRouter from "./routing/userRouter.js";

const app: Application = express();
const PORT: number = 3001;
const currentFolderPath = path.resolve();

app.use(cors());
app.use(express.json());
app.use("/images", express.static(path.join(currentFolderPath, "images"))); // постоянное исп. папки images

app.use("/authentication", authRouter);
app.use("/catalog", catalogRouter);
app.use("/admin", adminRouter);
app.use("/user", userRouter);

app.listen(PORT, () => {
  console.log(`Server has started on PORT ${PORT}`);
});
