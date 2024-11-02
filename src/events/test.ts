import { client } from "@/config/client";

export const test = () => {
  if (!client) return;
  client.on("messageCreate", (message) => {
    console.log("🚀 ~ client.on ~ message:", message.content);
    if (message.author.bot) return;
    if (message.content === "ping") {
      message.reply("pong");
    }
  });
};
