import fastify, {
  FastifyRequest,
  FastifyReply,
  HookHandlerDoneFunction,
} from "fastify";

import { SecurityTxt } from "sectxt";

const server = fastify();

const securityTxt = new SecurityTxt({
  contacts: ["mailto:security@example.org"],
  expires: new Date("9999-12-31"),
  preferredLanguages: ["en", "de"],
  hiring: ["https://secjobs.example.org"],
});

const sectxt = securityTxt.middleware();

server.addHook(
  "onRequest",
  (
    request: FastifyRequest,
    reply: FastifyReply,
    next: HookHandlerDoneFunction
  ) => {
    sectxt(request.raw, reply.raw, next);
  }
);

server.get("/", async (_request, _reply) => {
  return "Hello World!";
});

server.listen(8080, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server listening at ${address}`);
});
