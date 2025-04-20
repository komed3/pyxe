export type ColorSpaceID = 'HEX' | 'RGB';

export type ColorInstance = any;

export type ColorInput = ColorInstance | string;

export interface ColorSpaceFactory {
    id: ColorSpaceID
};

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

export interface TracerFactory {
    action: string;
    timestamp: Date | number;
    meta?: {
        input?: ColorObjectFactory | unknown;
        result?: ColorObjectFactory | unknown;
        [ key: string ] : any;
    };
}