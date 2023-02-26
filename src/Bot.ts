import { Client, InteractionType, Interaction } from "discord.js";
import { ClientEvent } from "@domain/event";
import { ApplicationCommandHandler, MessageComponentHandler } from "@domain/handler";
import Config from "@config/Config";
import RepositoryInterface from "@db/port/repository";
import Repository from "@db/adapter/sequelize/repository";
import MessageCommandHandler from "@handler/MessageCommand";

export class Bot {
    client: Client
    token: string
    applicationHandler: ApplicationCommandHandler = new ApplicationCommandHandler()
    messageComponentHandler: MessageComponentHandler = new MessageComponentHandler()
    messageCommandHandler: MessageCommandHandler = new MessageCommandHandler()
    database: RepositoryInterface = new Repository()

    constructor() {
        this.client = new Client({ intents: Config.INTENTS});
        this.token = Config.BOT.token;
    }
    
    initEvents()  {
        return new Promise((resolve, reject) => {
            this.client.on(ClientEvent.READY, () => this.finalizeReady());
            this.client.on(ClientEvent.ERROR, (e: { message: any; }) => console.error(e.message));
            this.client.on( ClientEvent.INTERACTION_CREATE, ( interaction: Interaction ) => {
                switch (interaction.type) {
                    case InteractionType.ApplicationCommand:
                        this.applicationHandler.handle(interaction)
                        break;
                    case InteractionType.ApplicationCommandAutocomplete:
                        console.log("application autocomplete")
                        break;
                    case InteractionType.MessageComponent:
                        // this.messageComponentHandler.handle(interaction)
                        console.log("MessageComponent")
                        break;
                    case InteractionType.ModalSubmit:
                        console.log("ModalSubmit")
                        break;

                    default:
                        break;
                }
            })
            this.client.on(ClientEvent.MESSAGE_CREATE, (message: any) => {
                this.messageCommandHandler.handle(message)
            });
            resolve(null)
        })
    }

    initModules() {
        return new Promise((resolve, reject) => {
            const modules = Config.MODULES
            const promises: Promise<any>[] = []
            modules.forEach((module) => {
                const promise = new Promise((resolve, reject) => {
                    import('@module/adapter/'+ module).then((module_class) => {
                        const command_class = new module_class.default(this)
                        resolve(null)
                    })
                })
                promises.push(promise)
            })
    
            Promise.all(promises).then((result) => {
                resolve(null)
            })
        })
    }

    initDataBase() {
        return new Promise<void>((resolve, reject) => {
            resolve()
            // this.database.connect()
        })
    }


    finalizeReady() {
        console.log("ready");
    }

    connect() {
        console.log('logging...');
        const promises = [this.initEvents(), this.initModules(), this.initDataBase()]
        Promise.all(promises).then((result) => {
            this.client.login(this.token);
        }).catch((err) => {
            console.log(err)
            this.client.login(this.token);
        })
    }

    deploy() {
        this.initModules().then(()=> {
            this.applicationHandler.deploy()
        })
    }
}

