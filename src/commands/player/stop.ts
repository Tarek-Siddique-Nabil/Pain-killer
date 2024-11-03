import type { CommandData, SlashCommandProps } from "commandkit";
import { useQueue } from "discord-player";
import { EmbedBuilder } from "discord.js";

export const data: CommandData = {
  name: "stop",
  description: "Stop the player",
};

export async function run({ interaction }: SlashCommandProps) {
  if (!interaction.inCachedGuild()) return;

  await interaction.deferReply();

  const queue = useQueue(interaction.guildId);

  if (!queue?.isPlaying()) {
    return await interaction.followUp("I am not playing anything here.");
  }

  queue.node.stop();

  const embed = new EmbedBuilder()
    .setTitle("Player Stopped")
    .setDescription("The player has been stopped.")
    .setColor(0x00fa9a)
    .setTimestamp();

  return interaction.editReply({ embeds: [embed] });
}
