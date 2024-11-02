import { useMainPlayer } from "discord-player";
import { Message } from "discord.js";

export const PlayCommand = async (message: Message, args: string) => {
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

  await message.reply(`Added ${result.track} tracks to the queue!`);
};
