import {
  ButtonKit,
  createSignal,
  type CommandData,
  type SlashCommandProps,
} from "commandkit";
import { useMainPlayer, useQueue, useTimeline } from "discord-player";
import {
  ActionRowBuilder,
  ApplicationCommandOptionType,
  ButtonInteraction,
  ButtonStyle,
  EmbedBuilder,
} from "discord.js";

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
function getButtons() {
  const play = new ButtonKit()
    .setEmoji("▶️")
    .setStyle(ButtonStyle.Primary)
    .setCustomId("play");
  const pause = new ButtonKit()
    .setEmoji("⏸️")
    .setStyle(ButtonStyle.Primary)
    .setCustomId("pause");
  const stop = new ButtonKit()
    .setEmoji("⏹️")
    .setStyle(ButtonStyle.Danger)
    .setCustomId("stop");

  const skip = new ButtonKit()
    .setEmoji("⏭️")
    .setStyle(ButtonStyle.Primary)
    .setCustomId("skip");
  const previous = new ButtonKit()
    .setEmoji("⏮️")
    .setStyle(ButtonStyle.Primary)
    .setCustomId("previous");
  const shuffle = new ButtonKit()
    .setEmoji("🔀")
    .setStyle(ButtonStyle.Primary)
    .setCustomId("shuffle");
  const repeat = new ButtonKit()
    .setEmoji("🔁")
    .setStyle(ButtonStyle.Primary)
    .setCustomId("repeat");
  const volumeUp = new ButtonKit()
    .setEmoji("🔊")
    .setStyle(ButtonStyle.Primary)
    .setCustomId("volumeUp");
  const volumeDown = new ButtonKit()
    .setEmoji("🔉")
    .setStyle(ButtonStyle.Primary)
    .setCustomId("volumeDown");

  const row1 = new ActionRowBuilder<ButtonKit>().addComponents(
    play,
    pause,
    stop,
    volumeUp,
    volumeDown
  );
  const row2 = new ActionRowBuilder<ButtonKit>().addComponents(
    shuffle,
    repeat,
    skip,
    previous
  );
  return {
    play,
    pause,
    stop,
    volumeUp,
    volumeDown,
    shuffle,
    repeat,
    skip,
    previous,
    row1,
    row2,
  };
}

export async function run({ interaction, client, handler }: SlashCommandProps) {
  const player = useMainPlayer();
  const query = interaction.options.getString("query", true);

  if (!interaction.inCachedGuild() || !interaction.member.voice.channel) {
    return interaction.reply("You need to join a voice channel first!");
  }
  await interaction.deferReply();
  if (!query) {
    return interaction.followUp("You need to provide a query or a link");
  }
  const result = await player.search(query, {
    requestedBy: interaction.user,
  });

  if (!result.tracks.length) {
    const embed = new EmbedBuilder()
      .setTitle("No tracks found")
      .setDescription("No tracks were found for the given query")
      .setColor(0xff0000)
      .setTimestamp();
    return interaction.followUp({ embeds: [embed] });
  }
  const amount = interaction.options.getInteger("value", false);
  try {
    await player.play(interaction.member.voice.channel, result.tracks[0], {
      nodeOptions: { metadata: { channel: interaction.channel }, volume: 50 },
    });
    const { row1, row2, play, pause, stop } = getButtons();
    const tl = useTimeline(interaction.guildId, { ignoreFilters: true });
    const queue = useQueue(interaction.guildId);

    const embed = new EmbedBuilder()
      .setTitle("Now Playing")
      .setDescription(
        `[${result.tracks[0].title}](${result.tracks[0].url}) - ${result.tracks[0].duration} minutes`
      )
      .setDescription(`Volume: ${tl?.volume}%  `)
      .setThumbnail(result.tracks[0].thumbnail)
      .setColor(0x00fa9a)
      .setTimestamp()
      .setFooter({
        iconURL: interaction.user.displayAvatarURL(),
        text: `Requested by ${interaction.user.username}`,
      });

    const message = await interaction.editReply({
      embeds: [embed],
      components: [row1, row2],
    });

    const collector = message.createMessageComponentCollector({
      filter: (btnInteraction) =>
        btnInteraction.user.id === interaction.user.id,
      componentType: 2,
    });

    if (!tl?.track) {
      return;
    }

    collector.on("collect", async (btnInteraction: ButtonInteraction) => {
      if (btnInteraction.customId === "play") {
        if (tl?.paused) {
          tl.resume();
          const embed = new EmbedBuilder()
            .setTitle("Resumed playback")
            .setColor(0x00fa9a);
          return btnInteraction.update({ embeds: [embed] });
        } else {
          const embed = new EmbedBuilder()
            .setTitle("Player is already playing")
            .setColor(0xff0000);
          return btnInteraction.update({ embeds: [embed] });
        }
      } else if (btnInteraction.customId === "pause") {
        if (!tl?.paused) {
          tl.pause();
          const embed = new EmbedBuilder()
            .setTitle("Paused playback")
            .setColor(0x00fa9a);
          return btnInteraction.update({ embeds: [embed] });
        } else {
          const embed = new EmbedBuilder()
            .setTitle("Player is already paused")
            .setColor(0xff0000);
          return btnInteraction.update({ embeds: [embed] });
        }
      } else if (btnInteraction.customId === "stop") {
        queue?.node.stop();
        player.destroy();
        collector.stop();

        const embed = new EmbedBuilder()
          .setTitle("Stopped playback")
          .setColor(0xff0000);
        return btnInteraction.update({ embeds: [embed], components: [] });

        // Stop collecting events after stop button is clicked
      } else if (btnInteraction.customId === "volumeUp") {
        if (tl.volume === 100) {
          const embed = new EmbedBuilder()
            .setTitle("Volume is already at max")
            .setColor(0xff0000);
          return btnInteraction.update({ embeds: [embed] });
        } else {
          queue?.node.setVolume(tl.volume + 10);
          // tl.setVolume(tl.volume + 10);
          const embed = new EmbedBuilder()
            .setTitle("Volume increased")
            .setColor(0x00fa9a);
          return btnInteraction.update({ embeds: [embed] });
        }
      } else if (btnInteraction.customId === "volumeDown") {
        if (tl.volume === 0) {
          const embed = new EmbedBuilder()
            .setTitle("Volume is already at min")
            .setColor(0xff0000);
          return btnInteraction.update({ embeds: [embed] });
        } else {
          console.log(tl.volume);
          queue?.node.setVolume(tl.volume - 10);
          // tl.setVolume(tl.volume - 10);
          const embed = new EmbedBuilder()
            .setTitle("Volume decreased")
            .setColor(0x00fa9a);
          return btnInteraction.update({ embeds: [embed] });
        }
      }
    });

    collector.on("end", () => {
      message.edit({ components: [] }); // Remove buttons after collector ends
    });

    return true;
  } catch (error) {
    console.error("Error handling command:", error);
    await interaction.followUp(
      "An error occurred while processing the command."
    );
  }
}
