import type { CommandData, SlashCommandProps } from "commandkit";

export const data: CommandData = {
  name: "reload",
  description: "Reloads a command",
};

export async function run({ interaction, client, handler }: SlashCommandProps) {
  await interaction.deferReply();
  await handler.reloadCommands();
  await interaction.followUp("Commands reloaded!");
  return true;
}
