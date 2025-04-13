/**
 * Pyxe Type Definitions
 * src/index.ts
 *
 * This file contains all type declarations used across the Pyxe framework. It provides
 * a centralized and consistent set of types for color spaces, conversions, parsers, and
 * outputs. These types are designed to be reusable and extendable, serving as a
 * foundation for all packages and modules within the framework.
 *
 * @package @pyxe/types
 * 
 * @author Paul Köhler (komed3)
 * @license MIT
 */

/**
 * --------------------------------------------------------------------------------
 * Color Types
 * --------------------------------------------------------------------------------
 */

/**
 * HEX Color Type (short, long, alpha).
 * Represents a hexadecimal color string, e.g., "#ffffff".
 */
export type HEX = `#${string}`;

/**
 * RGB Color Type with optional Alpha channel.
 * Represents a color in the RGB color space.
 */
export interface RGB {
    r: number; // 0 - 255
    g: number; // 0 - 255
    b: number; // 0 - 255
    a?: number; // 0 - 1 (optional alpha channel)
}

/**
 * HSL Color Type.
 * Represents a color in the HSL (Hue, Saturation, Lightness) color space.
 */
export interface HSL {
    h: number; // 0 - 360 (degrees)
    s: number; // 0 - 1 (percentage as a decimal)
    l: number; // 0 - 1 (percentage as a decimal)
}

/**
 * HSV Color Type.
 * Represents a color in the HSV (Hue, Saturation, Value) color space.
 */
export interface HSV {
    h: number; // 0 - 360 (degrees)
    s: number; // 0 - 1 (percentage as a decimal)
    v: number; // 0 - 1 (percentage as a decimal)
}

/**
 * CMYK Color Type.
 * Represents a color in the CMYK (Cyan, Magenta, Yellow, Key/Black) color space.
 */
export interface CMYK {
    c: number; // 0 - 1
    m: number; // 0 - 1
    y: number; // 0 - 1
    k: number; // 0 - 1
}

/**
 * XYZ Color Type.
 * Represents a color in the CIE 1931 XYZ color space.
 */
export interface XYZ {
    x: number; // 0 - 1
    y: number; // 0 - 1
    z: number; // 0 - 1
}

/**
 * CIELAB Color Type.
 * Represents a color in the CIELAB color space.
 */
export interface Lab {
    L: number; // 0 - 100
    a: number;
    b: number;
}

/**
 * --------------------------------------------------------------------------------
 * Color Spaces
 * --------------------------------------------------------------------------------
 */

/**
 * Identifier for supported color spaces.
 * Used for registries, the conversion graph and identifying color spaces.
 */
export type ColorSpaceId =
    | 'HEX' | 'RGB'
    | 'HSL' | 'HSV'
    | 'CMYK'
    | 'XYZ' | 'Lab';

/**
 * Generic representation of a color space conversion.
 */
export type ColorInstance = HEX | RGB | HSL | HSV | CMYK | XYZ | Lab;

/**
 * Standard input variants accepted by parser modules.
 */
export type ColorInput = string | ColorInstance;

/**
 * Generic representation of a color.
 * Contains the color space, value, and other metadata.
 */
export interface ColorObject {
    space: ColorSpaceId;
    value: ColorInstance;
    meta?: Record<string, any>
}

/**
 * --------------------------------------------------------------------------------
 * Names Color Lists / Color Libraries
 * --------------------------------------------------------------------------------
 */

/**
 * A named color entry in a color library (e.g. RAL, HTML, etc.)
 * Supports optional alternative representations.
 */
export interface NamedColor {
    name?: string; // canonical name
    meta?: Record<string, unknown>; // Optional metadata, e.g. source, tags
    HEX?: HEX; RGB?: RGB;
    HSL?: HSL; HSV?: HSV;
    CMYK?: CMYK;
    XYZ?: XYZ; Lab?: Lab;
}

/**
 * A full set of named colors, mapped by their key (e.g. "RAL 1000").
 */
export type NamedColorList = Record<string, NamedColor>;

/**
 * Metadata for a color library.
 * Contains additional data, e.g. source, version, license, tags, etc.
 */
export interface ColorLibMeta {
    id: string;
    title?: string;
    description?: string;
    version?: string;
    license?: string;
    source?: string;
    author?: string;
    tags?: string[];
    count: number;
}

/**
 * --------------------------------------------------------------------------------
 * Output Formats
 * --------------------------------------------------------------------------------
 */

/**
 * Available output formats supported by the framework.
 */
export type OutputFormat = 'string' | 'json';

/**
 * Interface for a set of output callbacks.
 */
export interface OutputMethods {
    toString?: ( color: ColorObject ) => string;
    toJSON?: ( color: ColorObject ) => unknown;
}

/**
 * --------------------------------------------------------------------------------
 * Callbacks
 * --------------------------------------------------------------------------------
 */

/**
 * Type definition for a validation callback.
 * Validates and converts input into a `ColorObject`.
 */
export type ValidatorCallback = (
    input: ColorInput
) => ColorObject | undefined;

/**
 * Type definition for a parser callback.
 * Attempts to match and convert the input to a specific color model.
 */
export type ParserCallback = (
    input: ColorInput
) => ColorObject | undefined;

/**
 * Type of a callable function to transform one color space into another.
 */
export type ConversionCallback = (
    color: ColorObject
) => ColorObject;

/**
 * Interface for a set of conversion callbacks.
 */
export interface ConversionPath {
    to: ColorSpaceId;
    callback: ConversionCallback;
}

/**
 * --------------------------------------------------------------------------------
 * Factories
 * --------------------------------------------------------------------------------
 */

/**
 * Factory for registering a new color space.
 * Contains color space name, callbacks, output formats and transformations.
 */
export interface ColorSpaceFactory {
    id: ColorSpaceId;
    validator?: ValidatorCallback;
    parser?: ParserCallback;
    conversions?: ConversionPath[];
    outputs?: OutputMethods;
}

/**
 * Factory for registering a new module.
 * Contains method name, handler, supported color spaces and optional parameters.
 * If "expose" is true, the module will be attached as method to the Color class.
 */
export interface ModuleFactory {
    id: string;
    handler: ( ...args: any [] ) => any;
    spaces: ColorSpaceId[];
    options?: Record<string, any>;
    exposeAsMethod?: boolean;
    multiInput?: boolean;
    returnType?: string;
}

/**
 * --------------------------------------------------------------------------------
 * Debugging
 * --------------------------------------------------------------------------------
 */

/**
 * Interface for tracing color object transformations / calculations.
 */
export interface DebugTrace {
    action: string;
    timestamp: Date | number;
    meta?: {
        origin?: ColorObject | unknown;
        result?: ColorObject | unknown;
        [ key: string ] : any;
    };
}