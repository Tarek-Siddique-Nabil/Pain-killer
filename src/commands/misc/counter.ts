import {
  type SlashCommandProps,
  createSignal,
  createEffect,
  ButtonKit,
} from "commandkit";
import {
  ButtonStyle,
  ActionRowBuilder,
  ButtonInteraction,
  type CacheType,
} from "discord.js";

export const data = {
  name: "counter",
  description: "A simple counter command",
};

function getButtons() {
  // Decrement button
  const dec = new ButtonKit()
    .setEmoji("➖")
    .setStyle(ButtonStyle.Primary)
    .setCustomId("decrement");

  // Reset button
  const reset = new ButtonKit()
    .setEmoji("0️⃣")
    .setStyle(ButtonStyle.Primary)
    .setCustomId("reset");

  // Increment button
  const inc = new ButtonKit()
    .setEmoji("➕")
    .setStyle(ButtonStyle.Primary)
    .setCustomId("increment");

  // Disposal button
  const trash = new ButtonKit()
    .setEmoji("🗑️")
    .setStyle(ButtonStyle.Danger)
    .setCustomId("trash");

  // Create an action row
  const row = new ActionRowBuilder<ButtonKit>().addComponents(
    dec,
    reset,
    inc,
    trash
  );

  return { dec, reset, inc, trash, row };
}

export const run = async ({ interaction }: SlashCommandProps) => {
  // Create the signal & buttons
  const [count, setCount, disposeCountSubscribers] = createSignal(0);
  const { dec, reset, inc, trash, row } = getButtons();

  // Temporary variable to hold button interactions
  let inter: ButtonInteraction<CacheType>;

  // Send the initial message with the buttons
  const message = await interaction.reply({
    content: `Count is ${count()}`,
    components: [row],
    fetchReply: true,
  });

  // Now, we subscribe to count signal and update the message every time the count changes
  createEffect(() => {
    // Make sure to "always" call the value function inside createEffect, otherwise the subscription will not occur
    const value = count();

    // Now udate the original message
    inter?.update(`Count is ${value}`);
  });

  // Handler to decrement the count
  dec.onClick(
    (interaction) => {
      inter = interaction;
      setCount((prev) => prev - 1);
    },
    { message }
  );

  // Handler to reset the count
  reset.onClick(
    (interaction) => {
      inter = interaction;
      setCount(0);
    },
    { message }
  );

  // Handler to increment the count
  inc.onClick(
    (interaction) => {
      inter = interaction;
      setCount((prev) => prev + 1);
    },
    { message }
  );

  // Disposal handler
  trash.onClick(
    async (interaction) => {
      const disposed = row.setComponents(
        row.components.map((button) => {
          // Remove the 'onClick' handler and disable the button
          return button.onClick(() => {}).setDisabled(true);
        })
      );

      // Dispose the signal's subscribers
      disposeCountSubscribers();

      // And finally: acknowledge the interaction
      await interaction.update({
        content: "Finished counting!",
        components: [disposed],
      });
    },
    { message }
  );
};
