'use strict';

export class Numeral {

    public static hexdec (
        hex: string
    ) : number {

        return parseInt( hex, 16 );

    }

    public static dechex (
        value: number
    ) : string {

        return Math.round( value )
            .toString( 16 )
            .padStart( 2, '0' );

    }

    public static dechexAlpha (
        alpha?: number
    ) : string {

        return typeof alpha === 'number'
            ? this.dechex( Math.round( alpha * 255 ) )
            : '';

    }

}