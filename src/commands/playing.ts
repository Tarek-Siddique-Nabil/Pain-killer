import { Message } from "discord.js";
import { useQueue } from "discord-player";

export const NowPlayingCommand = async (message: Message) => {
  const queue = useQueue();

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
