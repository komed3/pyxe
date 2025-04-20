export type ColorSpaceID = 'HEX' | 'RGB';

export interface ColorSpaceFactory {};

export type ColorInstance = any;

export interface ColorObjectFactory {
    space: ColorSpaceID;
    value: ColorInstance;
    meta?: Record<string, any>
}

export interface ErrorFactory {
    method: string;
    msg?: string;
    err?: Error | string | any;
}

export type HookHandler = (
    ...args: any[]
) => any;

export interface HookFactory {
    handler: HookHandler;
    priority: number;
    once?: boolean;
}