import { Hono } from "hono";
import { logger } from "hono/logger";
import { initializePlayer } from "./config/player";
import { initializeClient } from "./config/client";

const app = new Hono();

app.use(logger());
const client = initializeClient();

initializePlayer();

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

client.once("ready", () => {
  console.log("Bot is ready!");
});
export default {
  port: 8080,
  fetch: app.fetch,
};
