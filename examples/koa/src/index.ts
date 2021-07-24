import Koa from "koa";
import Router from "@koa/router";
import c2k from "koa-connect";
import { sectxt } from "sectxt";

const app = new Koa();

app.use(
  c2k(
    sectxt({
      contacts: ["mailto:security@example.org"],
      expires: new Date("9999-12-31"),
      preferredLanguages: ["en", "de"],
      hiring: ["https://secjobs.example.org"],
    })
  )
);

const router = new Router();

router.get("/", (ctx) => {
  ctx.body = "Hello World";
});

app.use(router.routes()).use(router.allowedMethods());

app.listen(3000);
