import type { CommandData, SlashCommandProps } from "commandkit";

export const data: CommandData = {
  name: "ping",
  description: "Pong!",
};

export function run({ interaction, client, handler }: SlashCommandProps) {
  interaction.reply(`:ping_pong: Pong! ${client.ws.ping}ms`);
}
