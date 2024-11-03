import type { CommandKit } from "commandkit";
import { useMainPlayer, useQueue } from "discord-player";
import { EmbedBuilder, type Client, type Message } from "discord.js";

export default async function (
  message: Message<true>,
  client: Client<true>,
  handler: CommandKit
) {
  const player = useMainPlayer();
  const prefix = "!";
  const channel = message.member?.voice.channel;
  if (!message.content.startsWith(prefix)) return;

  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const command = args.shift()?.toLowerCase();

  if (!channel) {
    return message.reply("You need to join a voice channel first!");
  }
  if (!command) {
    return;
  }

  if (command === "play") {
    const result = await player.search(args.join(" "), {
      requestedBy: message.author,
    });
    console.log(result.tracks);
    if (!result.tracks.length) {
      const embed = new EmbedBuilder()
        .setTitle("No tracks found")
        .setDescription("No tracks were found for the given query")
        .setColor(0xff0000)
        .setTimestamp();
      return message.reply({ embeds: [embed] });
    }
    try {
      await player.play(channel, result.tracks[0], {
        nodeOptions: {
          metadata: {
            channel: message.channel,
          },
        },
      });

      const embed = new EmbedBuilder()
        .setTitle("Added to queue")
        .setDescription(`Added ${result.tracks[0].title} to the queue`)
        .setThumbnail(result.tracks[0].thumbnail)
        .setAuthor({
          name: message.author.tag,
          iconURL: message.author.displayAvatarURL(),
        })
        .setColor(0x00fa9a)
        .setTimestamp();
      await message.reply({ embeds: [embed] });
      return true;
    } catch (error) {
      console.error(error);
      return message.reply("An error occurred while trying to play the track.");
    }
  }
}

// const NowPlayingCommand = async (message: Message) => {
//   const queue = useQueue(message.guildId as string);

//   if (!queue) {
//     return message.reply("I am not playing anything here.");
//   }

//   const currentTrack = queue.currentTrack;

//   if (!currentTrack) {
//     return message.reply("There is no track playing.");
//   }

//   await message.reply(
//     `Now playing: ${currentTrack.title} by ${currentTrack.author}`
//   );
// };

// const StopCommand = async (message: Message) => {
//   const queue = useQueue(message.guildId as string);
//   const channel = message.member?.voice.channel;

//   if (!channel) {
//     return message.reply("You need to join a voice channel first!");
//   }
//   if (!queue || !queue.isPlaying) {
//     return message.reply("I am not playing anything here.");
//   }

//   queue.node.stop();

//   await message.reply("Stopped playing!");
// };
