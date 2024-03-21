import lib from '../../../lib';
import { RepositoryType } from '../../../lib/types';
import { StorageRepository } from '../../../lib/repositories/storage';
export enum ImgType
{
    YES = "yes",
    NO = "no",
    STAND = "stand",
    ASS = "ass",
    PUSSY = "pussy",
    SUCK = "suck"
}

export class ImgHandler
{
    getImg ( type: string )
    {
        type = type.toLowerCase();
        return new Promise<any>( ( resolve, reject ) =>
        {

            if ( !Object.values( ImgType ).includes( type as ImgType ) )
            {
                reject( "Type d'image non autorisé" );
            }

            const storageRepository = lib.getRepository<StorageRepository>( RepositoryType.STORAGE );
            const imgPath = "modules/emira-conversation/img/" + type;
            storageRepository.listObjects( imgPath )
                .then( ( images ) =>
                {
                    if ( images.length === 0 )
                    {
                        reject( "Il n'y a pas d'images dans le dossier" );
                    }
                    const index = Math.floor( Math.random() * images.length );
                    storageRepository.getImage( images[ index ].Key ) // I would like to remove the .Key here
                        .then( ( img: any ) => { resolve( img ); } )
                        .catch( ( e: any ) => reject( e ) );
                } )
                .catch( ( error ) => console.log( JSON.stringify( error ) ) );
        } );
    }
}


