import RepositoryInterface from "@db/port/repository";

export default class Repository implements RepositoryInterface{
    connect(): Promise<void> {
        return new Promise((resolve, reject) => {
            console.log("repo")
            resolve()
        })
    }
    
}