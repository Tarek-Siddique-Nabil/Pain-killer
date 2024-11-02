import { useMainPlayer } from "discord-player";
import { Message } from "discord.js";

export const StopCommand = async (message: Message) => {
  const player = useMainPlayer();
  const channel = message.member?.voice.channel;
  if (!channel) {
    return message.reply("You need to join a voice channel first!");
  }
  player.destroy();
  await message.reply("Stopped playing!");
};
