import { PlayCommand } from "@/commands/play";
import { NowPlayingCommand } from "@/commands/playing";
import { StopCommand } from "@/commands/stop";
import { client } from "@/config/client";
import { player } from "@/config/player";

export const play = () => {
  if (!client) return;
  client.on("messageCreate", async (message) => {
    const prefix = "!";
    if (!message.content.startsWith(prefix)) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const command = args.shift();

    try {
      if (!message.guild || !player) return;
      await player.context.provide({ guild: message.guild }, () => {
        switch (command) {
          case "play":
            return PlayCommand(message, args.join(" "));
          case "np":
            return NowPlayingCommand(message);
          case "stop":
            return StopCommand(message);
        }
      });
    } catch (error) {}
  });
};
