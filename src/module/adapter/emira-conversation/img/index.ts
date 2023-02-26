import path from 'path';
import { nudes } from "./nude";
import * as fs from 'fs';
export enum ImgType
{
    NUDE = "nude",
    STRING = "string"
}

export class ImgHandler
{
    getImg ( type: string )
    {
        return new Promise<string>( ( resolve, reject ) =>
        {

            if ( !Object.values( ImgType ).includes( type as ImgType ) )
            {
                reject( "Type d'image non autorisé" );
            }
            //I only want the .png files
            const images = fs.readdirSync( path.resolve( __dirname, type ) ).filter( file => file.endsWith( ".png" ) );
            if ( images.length === 0 )
            {
                reject( "Il n'y a pas d'images dans le dossier" );
            }
            const index = Math.floor( Math.random() * images.length );
            //I want the path to the image
            resolve( path.resolve( __dirname, type, images[ index ] ) );

        } );
    }
}


