import type { CommandData, SlashCommandProps } from "commandkit";
import { useMainPlayer } from "discord-player";
import { ApplicationCommandOptionType, EmbedBuilder } from "discord.js";

export const data: CommandData = {
  name: "play",
  description: "Play a song",
  options: [
    {
      name: "query",
      description: "The song you want to play",
      type: ApplicationCommandOptionType.String,
      required: true,
    },
  ],
};

export async function run({ interaction, client, handler }: SlashCommandProps) {
  if (!interaction.inCachedGuild()) return;
  const player = useMainPlayer();
  const channel = interaction.member.voice.channel!;
  const query = interaction.options.getString("query");
  await interaction.deferReply();
  if (!channel) {
    return interaction.followUp("You need to join a voice channel first!");
  }
  if (!query) {
    return interaction.followUp("You need to provide a query or a link");
  }
  const result = await player.search(query, {
    requestedBy: interaction.user,
  });

  console.log(result.tracks);
  if (!result.tracks.length) {
    const embed = new EmbedBuilder()
      .setTitle("No tracks found")
      .setDescription("No tracks were found for the given query")
      .setColor(0xff0000)
      .setTimestamp();
    return interaction.followUp({ embeds: [embed] });
  }

  try {
    await player.play(channel, result.tracks[0], {
      nodeOptions: {
        metadata: {
          channel: interaction.channel,
        },
      },
    });
    const embed = new EmbedBuilder()
      .setTitle("Added to queue")
      .setDescription(`Added ${result.tracks[0].title} to the queue`)
      .setThumbnail(result.tracks[0].thumbnail)
      .setAuthor({
        name: interaction.user.tag,
        iconURL: interaction.user.displayAvatarURL(),
      })
      .setColor(0x00fa9a)
      .setTimestamp();

    await interaction.followUp({ embeds: [embed] });
    return true;
  } catch (error) {
    console.error("Error handling command:", error);
    await interaction.followUp(
      "An error occurred while processing the command."
    );
  }
}
