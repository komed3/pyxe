'use strict';

export type ColorSpaceID = string;

export type ColorInput = any;

export type ColorInstance = any;

export interface ColorObject {
    space: ColorSpaceID;
    value: ColorInstance;
    meta?: Record<string, any>;
};

export type ParserHandler = (
    input: ColorInput
) => ColorObject | undefined;

export type ValidatorHandler = (
    input: ColorInput
) => ColorObject | undefined;

export type ConversionHandler = (
    input: ColorObject | undefined
) => ColorObject | undefined;

export interface ConversionPath {
    target: ColorSpaceID;
    handler: ConversionHandler;
}

export interface ColorSpaceFactory {
    id: ColorSpaceID;
    validator: ValidatorHandler;
    parser: ParserHandler;
    conversions?: ConversionPath[];
}

export interface ErrorHandlerFactory {
    method: string;
    msg?: string;
    err?: Error | string | any;
}

export interface TracerFactory {
    action: string;
    timestamp: Date | number;
    meta?: {
        origin?: ColorObject | unknown;
        result?: ColorObject | unknown;
        [ key: string ] : any;
    };
}