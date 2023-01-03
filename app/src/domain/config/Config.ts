
import { GatewayIntentBits } from "discord.js";
import * as config from "./config.json";

export default class Config {
    static TOKEN: string = process.env.BOT_TOKEN as string
    static CLIENT_ID: string = process.env.CLIENT_ID as string
    static ALL_INTENTS = 7796
    static INTENTS: number[] = [GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.Guilds]
    static MODULES: string[] = config.modules
}