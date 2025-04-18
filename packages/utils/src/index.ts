'use strict';

import { PyxeError as error } from './lib/error.js';
import { hook } from './lib/hook.js';
import { tracer, tracerTemplates } from './lib/tracer.js';

export const Utils = {
    error, hook, tracer,
    tracerTemplates
};