export type HexColor = `#${string}`;
export type RGB = { r: number; g: number; b: number };
export type RGBa = { r: number; g: number; b: number; a: number };
export type Lab = { L: number; a: number; b: number };

export type NamedColor = {
    name?: string;
    hex?: HexColor;
    rgb?: RGB;
    rgba?: RGBa,
    lab?: Lab;
}

export type NamedColorList = Record<string, NamedColor>;