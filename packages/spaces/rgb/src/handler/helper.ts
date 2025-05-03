'use strict';

export const minMaxDelta = (
    r: number, g: number, b: number
) : { min: number; max: number; delta: number; } => {

    const [ min, max ] = [
        Math.min( r, g, b ),
        Math.max( r, g, b )
    ];

    return { min, max, delta: max - min };

};

export const computeHue = (
    r: number, g: number, b: number,
    max: number, delta: number
) : number => (
    max === r
        ? ( g - b ) / delta + ( g < b ? 6 : 0 )
        : max === g
            ? ( b - r ) / delta + 2
            : ( r - g ) / delta + 4
) * 60;