/**
 * HEX Color Type.
 */
export type HexColor = `#${string}`;

/**
 * RGB Color Type with optional Alpha channel.
 */
export interface RGB {
    r: number; // 0 - 255
    g: number; // 0 - 255
    b: number; // 0 - 255
    a?: number; // 0 - 1 (optional alpha channel)
}

/**
 * CIELAB Color Type.
 */
export interface Lab {
    L: number; // 0 - 100
    a: number;
    b: number;
}

/**
 * A named color entry in a color library (e.g. RAL, HTML, etc.)
 * Supports optional alternative representations.
 */
export interface NamedColor {
    /** Canonical name, e.g. "Signal yellow" */
    name?: string;

    /** HEX string representation */
    hex?: HexColor;

    /** RGB(A) representation */
    rgb?: RGB;

    /** Lab representation */
    lab?: Lab;

    /** Optional metadata, e.g. source, tags */
    meta?: Record<string, unknown>;
}

/**
 * A full set of named colors, mapped by their key (e.g. "RAL 1000").
 */
export type NamedColorList = Record<string, NamedColor>;

/**
 * Optional identifier for supported color spaces.
 * Used for parser registry and conversion graph.
 */
export type ColorSpaceId =
    | 'RGB' | 'HEX' | 'XYZ' | 'Lab';

/**
 * Generic representation of a color space conversion.
 */
export type ColorInstance = RGB | Lab;

/**
 * Standard input variants accepted by parser modules.
 */
export type ColorInput = string | RGB | HexColor;

/**
 * Generic representation of a color.
 * Containing color space, value and other data.
 */
export interface ColorObject {
    space: ColorSpaceId;
    value: ColorInstance;
}

/**
 * Type definition for a parser callback.
 * Each parser attempts to match and convert the input to a specific color model.
 */
export type ParserCallback = ( input: ColorInput ) => ColorObject | undefined;

/**
 * Type of a callable function to transform one color space into another.
 */
export type ConversionCallback = ( input: ColorObject ) => ColorObject | undefined;

/**
 * Interface for a set of conversion callbacks
 */
export interface ConversionPath {
    to: ColorSpaceId;
    callback: ConversionCallback;
}

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
 * Options for registering a new color space.
 */
export interface ColorSpaceRegistrationOptions {
    id: ColorSpaceId;
    validator: ( input: ColorInput ) => ColorObject;
    parser?: ParserCallback;
    conversions?: ConversionPath[];
    outputs?: OutputMethods;
}