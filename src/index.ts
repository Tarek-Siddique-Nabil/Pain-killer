import { Hono } from "hono";
import { logger } from "hono/logger";
import { initializePlayer } from "./config/player";
import { initializeClient } from "./config/client";
import { initializeEvents } from "./events";

const app = new Hono();

app.use(logger());
initializePlayer();
initializeClient();
initializeEvents();

// client.on("messageCreate", (message) => {
//   console.log("🚀 ~ client.on ~ message:", message.content);
//   if (message.author.bot) return;
//   if (message.content === "ping") {
//     message.reply("pong");
//   }
// });

// client.on("messageCreate", async (message) => {
//   await message.guild?.commands.set([
//     {
//       name: "play",
//       description: "Plays a song from youtube",
//       options: [
//         {
//           name: "query",
//           description: "The query to search for",
//           type: 3,
//           required: true,
//         },
//       ],
//     },
//     {
//       name: "skip",
//       description: "Skip to the current song",
//     },
//     {
//       name: "queue",
//       description: "See the queue",
//     },
//     {
//       name: "stop",
//       description: "Stop the player",
//     },
//   ]);
// });

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

export default {
  port: 8080,
  fetch: app.fetch,
};
