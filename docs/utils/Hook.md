# Hook Utility

The `Hook` utility in the pyxe framework provides a modular and extensible system for registering and executing named hooks. These hooks allow other modules, plugins, or internal components to respond to specific events (`actions`) or to process and modify data (`filters`) in a loosely coupled manner.

This mechanism is essential for enabling optional behaviors and plugin-based extensibility without hard dependencies between components. It is designed to be synchronous by default, with optional asynchronous and deferred execution. Filters return the modified data, whereas actions simply execute in order.

Key features are:

- Supports both **action** and **filter** hooks.
- **Multiple handlers** can be registered per hook, with custom **priority levels**.
- Handlers can be set to **run once** or **persist**.
- Supports **wildcard hook names** using `*`.
- Provides both **sync** and **async** execution paths.
- Includes **deferred** execution for low-priority background actions.

## Usage

```ts
import { Utils } from '@pyxe/utils';

...
```

## Internals

### `_register( name, handler [, priority = 10 [, once = false [, preSort = true ] ] ] )`

```ts
private _register (
  name: string,
  handler: HookHandler,
  priority: number = 10,
  once: boolean = false,
  preSort: boolean = true
) : void
```

Central method used by `add()` and `once()` to store hook metadata into the registry. Supports one-time handlers and optional sorting.

@param `name` - The name of the hook (can contain wildcards)  
@param `handler` - The callback to be executed  
@param `priority` - Sorting priority (lower executes earlier)  
@param `once` - Whether the handler should be removed after first execution  
@param `preSort` - Whether to sort the handlers immediately after registration

### `_match( name )`

```ts
private _match(
  name: string
) : [ string, HookFactory[] ][]
```

Resolves matching hook names using either direct equality or wildcard pattern matching (e.g., `color.*`).

@param `name` - The hook name to match against  
@returns Array of matching hook name and handler pairs

### `_sort( name )`

```ts
_sort (
  name: string
) : void
```

Sorts all registered handlers for a specific hook by their priority.

@param `name` - The name of the hook group to sort

### `_sortAll()`

```ts
_sortAll () : void
```

Sorts all hooks in the registry. Typically used when reordering is needed after bulk insertion.

## Methods

### `add( name, handler [, priority = 10 ] )`

```ts
add (
  name: string,
  handler: HookHandler,
  priority: number = 10
) : void
```

Registers a persistent hook handler for the given name. Handlers are sorted by priority (lower values run earlier).

@param `name` - The name of the hook  
@param `handler` - The callback to register  
@param `priority` - Execution priority (default: `10`)

### `once( name, handler [, priority = 10 ] )`

```ts
once (
  name: string,
  handler: HookHandler,
  priority: number = 10
) : void
```

Registers a hook handler that will only be executed once and is removed automatically after the first call.

@param `name` - The name of the hook  
@param `handler` - The callback to register  
@param `priority` - Execution priority (default: `10`)

### `remove( name [, handler ] )`

```ts
remove (
  name: string,
  handler?: HookHandler
) : void
```

Removes a specific handler from a hook. If handler is omitted, all handlers for the given hook name are removed.

@param `name` - The name of the hook  
@param `handler` - Specific handler to remove; if omitted, all handlers are removed

### `do( name, ...args )`

```ts
do (
  name: string,
  ...args: any[]
) : void
```

Executes all handlers registered for the given hook name in order of priority. Used for side-effect actions (no return values expected).

@param `name` - The name of the hook  
@param `args` - Arguments to pass to the handlers  
@throws If a hook failed to run

### `doAsync( name, ...args )`

```ts
async doAsync (
  name: string,
  ...args: any[]
) : Promise<void>
```

Asynchronous version of `do()`. Waits for all handlers (which may return promises) to finish in order.

@param `name` - The name of the hook  
@param `args` - Arguments to pass to the handlers  
@returns Promise that resolves when all handlers have completed  
@throws If a hook failed to run asynchronously

### `doDeferred( name, ...args )`

```ts
doDeferred (
  name: string,
  ...args: any[]
) : void
```

Triggers hook execution asynchronously in the next event loop cycle (using `setImmediate`). Useful for non-blocking actions.

@param `name` - The name of the hook  
@param `args` - Arguments to pass to the handlers  
@throws If a hook failed to run deferred

### `filter( name, input, ...args )`

```ts
filter (
  name: string,
  input: any,
  ...args: any[]
) : any
```

Executes all filter handlers for the given name, passing and transforming the input value through each handler.

@param `name` - The name of the hook  
@param `input` - The initial value to be filtered  
@param `args` - Additional arguments to pass to each handler  
@returns The final, filtered value  
@throws If an applied filter leads to an error

### `filterAsync( name, input, ...args )`

```ts
async filterAsync (
  name: string,
  input: any,
  ...args: any[]
) : Promise<any>
```

Asynchronous version of `filter()`. Each handler may return a promise, and the transformed result is awaited and passed to the next.

@param `name` - The name of the hook  
@param `input` - The initial value to be filtered  
@param `args` - Additional arguments to pass to each handler  
@returns Promise resolving to the final filtered value  
@throws If an applied filter leads to an error

## Singleton Export

```ts
export const hook = new Hook ();
```

This instance is used throughout the `pyxe` framework to hook into modules, calculations, methods and much more. It even lets users build entirely new hooks.

## Notes

- Wildcards (`*`) can be used in hook names for grouped matching. For example, registering a hook under `lib.*` will match `lib.loaded`, `lib.updated`, etc.
- It is safe to mutate arguments inside hooks, but immutability is preferred where possible.
- All errors thrown inside hooks are caught and rethrown as `PyxeError` instances for unified error handling.
