import { Repository, RepositoryType } from '../../types';

export interface Storage extends Repository
{

    listObjects: ( prefix: string ) => Promise<any[]>;
    getImage: ( key: string ) => Promise<any>;

}

export interface StorageFile
{
    name: string;
    size: number;
    contentType: string;
    lastModified: Date;
    buffer: Buffer;
}

export class StorageRepository implements Storage
{
    listObjects ( prefix: string ): Promise<any[]>
    {
        throw new Error( "Method not implemented." );
    }
    getImage ( key: string ): Promise<any>
    {
        throw new Error( "Method not implemented." );
    }

    getText ( key: string ): Promise<string>
    {
        throw new Error( "Method not implemented." );
    }
    type: RepositoryType = RepositoryType.STORAGE;
}