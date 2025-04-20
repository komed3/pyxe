export type ColorSpaceID = 'HEX' | 'RGB';

export interface ColorChannelMeta {
    name: string;
    range: [ number, number ];
    unit?: string;
    description?: string;
}

export interface ColorSpaceMeta {
    name: string;
    description?: string;
    type: 'numeric' | 'encoded' | 'perceptual' | string;
    channels: Record<string, ColorChannelMeta>;
    alpha?: boolean;
    spaces?: string[];
    output?: string[];
    cssSupport?: boolean;
}

export interface ColorSpaceFactory {
    id: ColorSpaceID;
    validator: unknown;
    parser: unknown;
    conversions?: unknown;
    output?: unknown;
    meta?: ColorSpaceMeta;
}