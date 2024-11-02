// src/config/player.ts
import { Player } from "discord-player";
import { YoutubeiExtractor } from "discord-player-youtubei";
import { client } from "./client";

let player: Player | null = null;

export const initializePlayer = async () => {
  if (!player && client) {
    player = new Player(client);

    player.extractors.loadDefault((ext) => ext !== "YouTubeExtractor");
    player.extractors.register(YoutubeiExtractor, {
      authentication: process.env.YOUTUBE_COOKIE as string,
    });

    player.on("debug", (message) => {
      console.log(`[Player] ${message}`);
    });

    player.events.on("debug", (queue, message) => {
      console.log(`[${queue.guild.name}: ${queue.guild.id}] ${message}`);
    });
  }

  return player;
};

export { player };
