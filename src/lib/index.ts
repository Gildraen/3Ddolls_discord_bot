import { Repository, RepositoryConfig, RepositoryType, RepositoryMap } from './types';
class Lib
{

    private _repositories: Repository[] = [];
    private static _instance: Lib;
    private _repositoryMap: RepositoryMap<RepositoryType> = {} as RepositoryMap<RepositoryType>;
    private constructor () { }
    static getInstance (): Lib
    {
        if ( !Lib._instance )
        {
            Lib._instance = new Lib();
        }

        return Lib._instance;
    }
    initRepositories ( config: RepositoryConfig[] )
    {
        return new Promise<void>( ( resolve, reject ) =>
        {
            const promises: Promise<void>[] = [];
            const typesSeen = new Set();
            config.forEach( ( repoConfig: RepositoryConfig ) =>
            {
                const promise = new Promise<void>( ( resolve, reject ) =>
                {
                    if ( typesSeen.has( repoConfig.type ) )
                    {
                        reject( `Duplicate repository type found: ${ repoConfig.type }` );
                    }
                    typesSeen.add( repoConfig.type );
                    import( `./repositories/${ repoConfig.type }/${ repoConfig.name }` ).then( ( repoModule ) =>
                    {
                        const repo = new repoModule.default( repoConfig.properties );
                        this._repositories.push( repo );
                        this._repositoryMap[ repoConfig.type ] = repo;
                        resolve();
                    } );
                } );
                promises.push( promise );
            } );

            Promise.all( promises ).then( () =>
            {
                resolve();
            } ).catch( ( error ) =>
            {
                reject( error );
            } )
                ;
        } );
    }

    getRepository<T extends Repository> ( type: RepositoryType ): T
    {
        const repo = this._repositories.find( ( repo ) => repo.type === type );
        if ( !repo )
        {
            throw new Error( `Repository of type '${ type }' not found` );
        }
        // if(repo.type !=  type){
        //     throw new Error( `Bad type fond` );
        // }
        return repo as T;
    }
}

export default Lib.getInstance();
