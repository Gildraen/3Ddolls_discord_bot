export interface Repository
{
    type: RepositoryType;
}


export enum RepositoryType
{
    STORAGE = "storage",
    COMMUNICATION = "communication"
}

export type RepositoryConfig = {
    type: RepositoryType;
    name: string;
    properties: any;
};

export type RepositoryMapType = {
    [ key: string ]: { new( ...args: any[] ): Repository; };
};
export type RepositoryMap<T extends RepositoryType> = {
    [ key in T ]: InstanceType<RepositoryMapType[ key ]>;
};
