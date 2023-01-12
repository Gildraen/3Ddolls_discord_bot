import RepositoryInterface from "@db/port/repository";

export default class Repository implements RepositoryInterface{
    connect(): Promise<void> {
        throw new Error("Method not implemented.");
    }
    
}