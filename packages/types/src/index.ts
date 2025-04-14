'use strict';

export type ColorInput = any;

export type ColorObject = any;

export type ColorSpaceName = string;

export type ParserHandler = (
    input: ColorInput
) => ColorObject | undefined;

export type ValidatorHandler = (
    input: ColorInput
) => ColorObject | undefined;

export type ConversionHandler = (
    color: ColorObject
) => ColorObject | undefined;

export interface ConversionPath {
    target: ColorSpaceName;
    handler: ConversionHandler;
}

export interface ColorSpaceFactory {
    name: ColorSpaceName;
    validator: ValidatorHandler;
    parser: ParserHandler;
    transformations?: ConversionPath[];
}

export interface ErrorHandlerFactory {
    method: string;
    msg?: string;
    err?: Error | string | any;
}