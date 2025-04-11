/**
 * HEX Color Type
 */
export type HexColor = `#${string}`;

/**
 * RGB Color Type with optional Alpha channel
 */
export interface RGB {
  r: number; // 0 - 255
  g: number; // 0 - 255
  b: number; // 0 - 255
  a?: number; // 0 - 1 (optional alpha channel)
}

/**
 * CIELAB Color Type
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
 * A full set of named colors, mapped by their key (e.g. "RAL 1000")
 */
export type NamedColorList = Record<string, NamedColor>;

/**
 * Optional identifier for supported color spaces
 * Used for parser registry and conversion graph
 */
export type ColorSpaceID =
  | 'rgb'
  | 'lab'
  | 'hex'; // Not a true color space, but supported for parsing

/**
 * Generic representation of a color space conversion
 */
export type ColorInstance = RGB | Lab;

/**
 * Standard input variants accepted by parser modules
 */
export type ColorInput = string | RGB | HexColor;

/**
 * Resulting object after parsing or conversion
 */
export interface ParsedColor {
  space: ColorSpaceID;
  value: ColorInstance;
  alpha?: number;
  original?: unknown;
}