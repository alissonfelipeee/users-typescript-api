import express from "express";
import swaggerUi from "swagger-ui-express";
import { config } from "dotenv";
import { router } from "./routes/router";
import swaggerDocs from "./swagger.json";

config();

const app = express();
const port = process.env.PORT || 3000;
const optionsSwagger = {
  customCssUrl: "http://localhost:3000/public/css/dark-swagger.css",
}

app.use(express.json());

app.use(router);
app.use("/public", express.static("public"));
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs, optionsSwagger));

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
