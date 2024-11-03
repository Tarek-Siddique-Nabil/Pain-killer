import type { CommandData, SlashCommandProps } from "commandkit";

export const data: CommandData = {
  name: "ping",
  description: "Pong!!!",
};

export async function run({ interaction, client, handler }: SlashCommandProps) {
  await interaction.reply(`:ping_pong: Pong! ${client.ws.ping}ms`);
  return true;
}
