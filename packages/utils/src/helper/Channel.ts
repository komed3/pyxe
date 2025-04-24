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

    public static parseAlpha (
        input: any
    ) : number | undefined {

        return input !== undefined
            ? Channel.parseLinear( input )
            : undefined;

    }

    public static format (
        value: number,
        options: {
            unit?: 'percent' | 'deg' | unknown;
            max?: number;
            decimals?: number;
            prefix?: string;
            suffix?: string;
        } = {}
    ) : string {

        const {
            unit = null, max = 1, decimals = 0,
            prefix = undefined, suffix = undefined
        } = options;

        let result, start, end;

        switch ( unit ) {

            default:
                result = value;
                start = prefix;
                end = suffix;
                break;

            case 'percent':
                result = value / max * 100;
                start = prefix;
                end = suffix ?? '%';
                break;

            case 'deg':
                result = value % 360;
                start = prefix;
                end = suffix ?? 'deg';
                break;

        }

        return `${ ( start ?? '' ) }${ (
            Number( result.toFixed( decimals ) ).toString()
        ) }${ ( end ?? '' ) }`;

    }

    public static formatAlpha (
        value: any,
        options: {
            decimals?: number;
        } = {}
    ) : string {

        return this.format( parseFloat( value ?? 1 ), {
            unit: null, max: 1, decimals: options.decimals ?? 2
        } );

    }

}