'use strict';

export type DebugLevel = 'silent' | 'error' | 'warn' | 'info' | 'debug' | 'all';

export type DebugTypes = 'debug' | 'info' | 'warn' | 'log' | 'error';

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
        input?: any;
        result?: any;
        [ key: string ]: any;
    };
}

export interface ErrorFactory {
    method: string;
    err?: Error | string | any;
    msg?: string;
}