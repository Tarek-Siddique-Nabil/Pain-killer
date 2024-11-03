import type { CommandData, SlashCommandProps } from "commandkit";
import { useMainPlayer } from "discord-player";
import { ApplicationCommandOptionType } from "discord.js";

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
  try {
    await player.play(channel, result.tracks[0], {
      nodeOptions: {
        metadata: {
          channel: interaction.channel,
        },
      },
    });
    await interaction.followUp(
      `Added ${result.tracks[0].title} track(s) to the queue!`
    );
  } catch (error) {
    console.error("Error handling command:", error);
    await interaction.followUp(
      "An error occurred while processing the command."
    );
  }
}
