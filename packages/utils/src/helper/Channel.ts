'use strict';

export class Channel {

    public static clamp (
        value: number,
        min: number,
        max: number
    ) : number {

        return Math.max( Math.min( value, max ), min );

    }

    public static normalize (
        value: number,
        min: number,
        max: number
    ) : number {

        return ( this.clamp( value, min, max ) - min ) / ( max - min );

    }

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
        min: number = 0,
        fallback: number = 0
    ) : number {

        const normalized = '0' + input.toString().trim();

        const result = normalized.endsWith( '%' )
            ? ( parseFloat( normalized ) / 100 ) * max
            : parseFloat( normalized );

        return Number.isFinite( result )
            ? this.clamp( result, min, max )
            : fallback;

    }

    public static parseCyclic (
        input: string | number,
        max: number = 360,
        min: number = 0,
        fallback: number = 0
    ) : number {

        const normalized = '0' + input.toString().replace(/[°\s]/g, '').trim();

        const result = ( ( parseFloat( normalized ) % max ) + max ) % max;

        return Number.isFinite( result )
            ? this.clamp( result, min, max )
            : fallback;

    }

    public static parseAlpha (
        input: any,
        fallback?: number
    ) : number | undefined {

        return input !== undefined
            ? Channel.parseLinear( input )
            : fallback;

    }

    public static safeAlpha (
        input: any
    ) : Partial<{ a: number }> {

        return ! isNaN( input ) ? { a: this.clamp( input, 0, 1 ) } : {};

    }

    public static format (
        value: number,
        options: {
            unit?: 'percent' | 'deg' | 'normalized' | unknown;
            min?: number; max?: number;
            decimals?: number;
            prefix?: string;
            suffix?: string;
        } = {}
    ) : string {

        const {
            unit = null, min = 0, max = 1, decimals = 0,
            prefix = undefined, suffix = undefined
        } = options;

        let result, start, end,
            minDecimals = 0;

        switch ( unit ) {

            default:
                result = this.clamp( value, min, max );
                start = prefix;
                end = suffix;
                break;

            case 'percent':
                result = this.normalize( value, min, max ) * 100;
                start = prefix;
                end = suffix ?? '%';
                break;

            case 'deg':
                result = this.clamp( value, min, max ) % 360;
                start = prefix;
                end = suffix ?? 'deg';
                break;

            case 'normalized':
                result = this.normalize( value, min, max );
                start = prefix;
                end = suffix;
                minDecimals = 2;
                break;

        }

        return `${ ( start ?? '' ) }${ (
            Number( result.toFixed(
                Math.max( decimals, minDecimals )
            ) ).toString()
        ) }${ ( end ?? '' ) }`;

    }

    public static formatAlpha (
        value: any,
        options: {
            decimals?: number;
        } = {}
    ) : string {

        return this.format( parseFloat( value ?? '1' ), {
            unit: null, max: 1, decimals: options.decimals ?? 2
        } );

    }

}