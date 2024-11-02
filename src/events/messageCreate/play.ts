import type { CommandKit } from "commandkit";
import { useMainPlayer, useQueue } from "discord-player";
import type { Client, Message } from "discord.js";

export default async function (
  message: Message<true>,
  client: Client<true>,
  handler: CommandKit
) {
  const player = useMainPlayer();
  const prefix = "!";
  if (!message.content.startsWith(prefix)) return;

  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const command = args.shift()?.toLowerCase();

  try {
    await player.context.provide({ guild: message.guild }, () => {
      switch (command) {
        case "play":
          return PlayCommand(message, args.join(" "));
        case "np":
          return NowPlayingCommand(message);
        case "stop":
          return StopCommand(message);
        default:
          return message.reply("Unknown command!");
      }
    });
  } catch (error) {
    console.error("Error handling command:", error);
    await message.reply("An error occurred while processing the command.");
  }
}

const PlayCommand = async (message: Message, args: string) => {
  const player = useMainPlayer();

  const channel = message.member?.voice.channel;
  if (!channel) {
    return message.reply("You need to join a voice channel first!");
  }
  const query = args;
  const result = await player.play(channel, query, {
    nodeOptions: {
      metadata: {
        channel: message.channel,
      },
    },
  });

  await message.reply(`Added ${result.track.title} track(s) to the queue!`);
};

const NowPlayingCommand = async (message: Message) => {
  const queue = useQueue(message.guildId as string);

  if (!queue) {
    return message.reply("I am not playing anything here.");
  }

  const currentTrack = queue.currentTrack;

  if (!currentTrack) {
    return message.reply("There is no track playing.");
  }

  await message.reply(
    `Now playing: ${currentTrack.title} by ${currentTrack.author}`
  );
};

const StopCommand = async (message: Message) => {
  const queue = useQueue(message.guildId as string);
  const channel = message.member?.voice.channel;

  if (!channel) {
    return message.reply("You need to join a voice channel first!");
  }
  if (!queue || !queue.isPlaying) {
    return message.reply("I am not playing anything here.");
  }

  queue.node.stop();

  await message.reply("Stopped playing!");
};
