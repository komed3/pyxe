'use strict';

import { PyxeError as error } from './services/PyxeError.js';
import { hook } from "./services/Hook.js";
import { tracer, tracerTemplates } from './services/Tracer.js';

export const Utils = {
    Helper: {},
    Services: {
        error, hook, tracer
    },
    tracerTemplates
};