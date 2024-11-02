import { Hono } from "hono";
import { logger } from "hono/logger";
import { initializePlayer } from "./config/player";
import { initializeClient } from "./config/client";

const app = new Hono();

app.use(logger());
initializePlayer();
initializeClient();

// client.on("messageCreate", (message) => {
//   console.log("🚀 ~ client.on ~ message:", message.content);
//   if (message.author.bot) return;
//   if (message.content === "ping") {
//     message.reply("pong");
//   }
// });

// client.on("messageCreate", async (message) => {
//   const prefix = "!";
//   if (!message.content.startsWith(prefix)) return;

//   const args = message.content.slice(prefix.length).trim().split(/ +/);
//   const command = args.shift();

//   try {
//     if (!message.guild || !player) return;
//     await player.context.provide({ guild: message.guild }, () => {
//       switch (command) {
//         case "play":
//           return PlayCommand(message, args.join(" "));
//         case "np":
//           return NowPlayingCommand(message);
//         case "stop":
//           return StopCommand(message);
//       }
//     });
//   } catch (error) {}
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
