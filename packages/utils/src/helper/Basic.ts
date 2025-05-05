'use strict';

export class Basic {

    public static timestamp () {

        return ( new Date() ).toISOString().slice( 11, 23 ).replace( 'T', ' ' );

    }

    public static hexdec (
        hex: string
    ) : number {

        return parseInt( hex, 16 );

    }

    public static dechex (
        value: number
    ) : string {

        return Math.round( value ).toString( 16 ).padStart( 2, '0' );

    }

}