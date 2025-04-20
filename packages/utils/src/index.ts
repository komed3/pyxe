'use strict';

import { PyxeError as error } from './services/PyxeError.js';
import { hook } from './services/Hook.js';
import { tracer, tracerTemplates } from './services/Tracer.js';

const Utils = {
    error, hook, tracer,
    tracerTemplates
};

export default Utils;