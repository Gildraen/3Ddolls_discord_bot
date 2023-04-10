import { GetObjectCommand, ListObjectsCommand, S3Client, _Object } from '@aws-sdk/client-s3';
import { StorageRepository } from '.';

type S3Properties = {
    bucketName: string;
    region: string;
};
export default class S3 extends StorageRepository
{
    private s3Client: S3Client;

    constructor ( private readonly properties: S3Properties )
    {
        super();
        this.s3Client = new S3Client( { region: this.properties.region } );
    }

    async listObjects ( prefix: string ): Promise<_Object[]>
    {
        const params = {
            Bucket: this.properties.bucketName,
            Prefix: prefix,
        };
        const command = new ListObjectsCommand( params );
        const response = await this.s3Client.send( command );
        return response.Contents ?? [];
    }
    async getImage ( key: string ): Promise<any>
    {
        const command = new GetObjectCommand( { Bucket: this.properties.bucketName, Key: key } );


        const response = await this.s3Client.send( command );
        // const body = await collectBody( response.Body );
        if ( !response.Body || response.Body == undefined )
        {
            throw new Error( "No body found in S3 response" );
        }

        const stream = response.Body.transformToWebStream();
        const reader = stream.getReader();
        const chunks = [];
        while ( true )
        {
            const { done, value } = await reader.read();
            if ( done )
            {
                break;
            }
            if ( value )
            {
                chunks.push( value );
            }
        }
        const arrayBuffer = new Uint8Array( chunks.reduce( ( acc, chunk ) =>
        {
            return acc.concat( Array.from( new Uint8Array( chunk ) ) );
        }, [] ) ).buffer;
        const buffer = Buffer.from( arrayBuffer );
        return buffer;
    }

    async getText ( key: string ): Promise<string>
    {
        const command = new GetObjectCommand( { Bucket: this.properties.bucketName, Key: key } );
        try
        {
            const response = await this.s3Client.send( command );

            if ( !response.Body || response.Body == undefined )
            {
                throw new Error( "No body found in S3 response" );
            }
            return response.Body.transformToString();

        } catch ( error )
        {
            console.log( "error" );
            throw new Error( "Error while getting text from S3" );
        }
    }
}
