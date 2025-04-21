'use strict';

import { ColorObjectFactory } from './core.js';

export type HookHandler = (
    ...args: any[]
) => any;

export interface HookFactory {
    handler: HookHandler;
    priority: number;
    once?: boolean;
}

export interface ErrorFactory {
    method: string;
    msg?: string;
    err?: Error | string | any;
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