'use strict';

export function parseLinearChannel (
    input: string | number,
    max: number = 1
) : number {

    const normalized = input.toString().trim();

    return normalized.endsWith( '%' )
        ? ( parseFloat( normalized ) / 100 ) * max
        : parseFloat( normalized );

}

export function parseCyclicChannel (
    input: string | number,
    max: number = 360
) : number {

    const normalized = input.toString().replace(/[°\s]/g, '').trim();

    return ( ( parseFloat( normalized ) % max ) + max ) % max;

}