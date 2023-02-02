
import { GatewayIntentBits } from "discord.js";
import * as config from "./config.json";

export default class Config {
    static ALL_INTENTS = 7796
    static INTENTS: number[] = [GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.Guilds]
    static MODULES: string[] = config.modules
    static BOT = config.bot
    static OPEN_AI = config.open_ai
}