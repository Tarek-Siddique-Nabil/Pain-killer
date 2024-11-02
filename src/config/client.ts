// src/config/client.ts
import { Client } from "discord.js";
import { CommandKit } from "commandkit";
import { CommandsPath, EventsPath } from "@/utils/constant";

let client: Client | null = null;

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

    client.login(process.env.DISCORD_TOKEN);

    new CommandKit({
      client,
      bulkRegister: false,
      skipBuiltInValidations: true,
      eventsPath: EventsPath,
      commandsPath: CommandsPath,
    });
  }

  return client;
};

export { client };
