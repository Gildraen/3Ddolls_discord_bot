import Config from "@config/Config";
import ApplicationCommandInterface from "@module/port/ApplicationCommand";
import { CommandInteraction, REST, RESTPostAPIApplicationCommandsJSONBody, Routes } from "discord.js";

export default class ApplicationCommandHandler {

    commands: ApplicationCommandInterface[] = []

    handle(interaction: CommandInteraction): void {
        const commandName = interaction.commandName
        const command = this.commands.find(command => command.name == commandName)
        if (command == null)
            return
        if (command.canExecute(interaction))
            command.execute(interaction)
    }

    deploy() {
        const rest = new REST({ version: '10' }).setToken(Config.TOKEN);
        const slashCommands: RESTPostAPIApplicationCommandsJSONBody[] = []
        this.commands.forEach((command) => {
            const slashCommand = command.getSlashCommand()
            slashCommands.push(slashCommand.toJSON())
        })
        rest.put(Routes.applicationCommands(Config.CLIENT_ID), { body: slashCommands },).then((result) => {
        }).catch((err) => {
            console.log(err)
        }).finally(() => {
        })

    }
}