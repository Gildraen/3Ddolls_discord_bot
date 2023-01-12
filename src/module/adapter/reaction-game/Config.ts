import ConfigInterface from "@module/port/Config";

export class Config implements ConfigInterface {
    static MODULE_NAME: string = "Reaction Game";
    static POINTS: number[] = [10,5,2,2,1]
    static EXECUTER_ROLES: string[] = ["682154319369601024"]
    static COMMAND_CHANNEL_ID: string = "947537275028389959"
}