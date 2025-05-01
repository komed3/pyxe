'use strict';

import { debug, type Debug } from './services/Debug.js';
import { hook, type Hook } from './services/Hook.js';
import { tracer, type Tracer, tracerTemplates } from './services/Tracer.js';
import { PyxeError } from './services/PyxeError.js';

export * as ErrorUtils from './services/ErrorUtils.js';

export const Services: {
    Debugger: Debug,
    Hook: Hook,
    Tracer: Tracer,
    Error: typeof PyxeError
} = {
    Debugger: debug,
    Hook: hook,
    Tracer: tracer,
    Error: PyxeError
};

export const templates: {
    tracer: typeof tracerTemplates
} = {
    tracer: tracerTemplates
};