import type { Message, Client } from "discord.js";
import type { CommandKit } from "commandkit";

export default function (
  message: Message<true>,
  client: Client<true>,
  handler: CommandKit
) {
  if (message.content === "hey") {
    message.reply("Hi!");
  }
  if (message.content === "hi") {
    message.reply("hey!");
  }
}
