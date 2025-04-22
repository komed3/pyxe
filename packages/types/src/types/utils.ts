'use strict';

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