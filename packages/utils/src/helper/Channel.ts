'use strict';

export class Channel {

    public static validateNumeric (
        input: any,
        min: number = 0,
        max: number = 1
    ) : boolean {

        return (
            !isNaN( input ) &&
            Number.isFinite( input ) &&
            input >= min &&
            input <= max
        );

    }

    public static validateAlpha (
        input: any
    ) : boolean {

        return input === undefined || this.validateNumeric( input );

    }

    public static parseLinear (
        input: string | number,
        max: number = 1,
        fallback: number = 0
    ) : number {

        const normalized = input.toString().trim();

        const result = normalized.endsWith( '%' )
            ? ( parseFloat( normalized ) / 100 ) * max
            : parseFloat( normalized );

        return Number.isFinite( result ) ? result : fallback;

    }

    public static parseCyclic (
        input: string | number,
        max: number = 360,
        fallback: number = 0
    ) : number {

        const normalized = input.toString().replace(/[°\s]/g, '').trim();

        const result = ( ( parseFloat( normalized ) % max ) + max ) % max;

        return Number.isFinite( result ) ? result : fallback;

    }

}