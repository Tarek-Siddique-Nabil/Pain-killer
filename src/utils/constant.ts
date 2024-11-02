import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { join } from "node:path";

const getDirname = (url: string) => dirname(fileURLToPath(url));
export const EventsPath = join(getDirname(import.meta.url), "..", "events");
export const CommandsPath = join(getDirname(import.meta.url), "..", "commands");
