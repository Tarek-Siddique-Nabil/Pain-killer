import { EmbedBuilder } from "@discordjs/builders";
import type { CommandData, SlashCommandProps } from "commandkit";
import { usePlayer, useTimeline } from "discord-player";
import { Embed } from "discord.js";

export const data: CommandData = {
  name: "np",
  description: "Show the current playing track",
};

export async function run({ interaction, client, handler }: SlashCommandProps) {
  if (!interaction.inCachedGuild()) return;

  await interaction.deferReply();

  const node = usePlayer(interaction.guildId)!;
  const timeline = useTimeline(interaction.guildId);

  if (!timeline?.track) {
    return interaction.followUp("I am not playing anything here.");
  }

  const embed = new EmbedBuilder()
    .setTitle("Now Playing")
    .setDescription(`[${timeline.track.title}](${timeline.track.url})`)
    .setThumbnail(timeline.track.thumbnail)
    .setColor(0x00fa9a)
    .setTimestamp();
  await interaction.followUp({ embeds: [embed] });
}
