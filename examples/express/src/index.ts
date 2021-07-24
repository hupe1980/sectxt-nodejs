import express from "express";
import { sectxt } from "sectxt";

const app = express();

app.use(
  sectxt({
    contacts: ["mailto:security@example.org"],
    expires: new Date("2022-12-31"),
    preferredLanguages: ["en", "de"],
    hiring: ["https://secjobs.example.org"],
  })
);

app.get("/", (_req, res) => {
  res.send("Hello world!");
});

app.listen(3000, () => {
  console.log("The application is listening on port 3000!");
});
