import { CommandKit } from "commandkit";
import { BaseClient, Client } from "discord.js";
import path from "path";
// const client = new Client({
//   intents: [
//     "Guilds",
//     "GuildMessages",
//     "GuildVoiceStates",
//     "DirectMessages",
//     "DirectMessageReactions",
//     "MessageContent",
//   ],
// });
// client.login(Bun.env.DISCORD_TOKEN);

// const commandKit = new CommandKit({
//   client,
//   bulkRegister: false,
//   // commandsPath: path.join(__dirname, "commands"),
//   // eventsPath: path.join(__dirname, "events"),
//   // validationsPath: path.join(__dirname, "validations"),
//   skipBuiltInValidations: true,
// });

// client.once("ready", () => {
//   console.log("Bot is ready!");
// });

// export { client, commandKit };

let client: Client<boolean> | null = null;

export const initializeClient = () => {
  if (!client) {
    client = new Client({
      intents: [
        "Guilds",
        "GuildMessages",
        "GuildVoiceStates",
        "DirectMessages",
        "DirectMessageReactions",
        "MessageContent",
      ],
    });
    client.login(Bun.env.DISCORD_TOKEN);

    new CommandKit({
      client,
      bulkRegister: false,
      skipBuiltInValidations: true,
    });

    console.log("Bot initialized");

    client.once("ready", () => {
      console.log("Bot is ready!");
    });
  }
  return client;
};

export { client };
