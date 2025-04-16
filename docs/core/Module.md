# Core Module Manager

The `pyxe` framework comes with a flexible and extensible **module system** to perform dynamic operations on color objects. These modules provide a standardized way to apply color transformations, generate gradients, calculate contrast, invert values, and much more—without embedding this logic directly in the core API.

Modules are implemented as self-contained logic blocks that are:

- independently defined (e.g. in packages like `@pyxe/invert`, `@pyxe/gradient`, etc.)
- dynamically registered at runtime via the `Module` registry
- optionally exposed as methods on the `Color` class (e.g. `color.invert()`), depending on the module definition
- self-responsible for validating input and handling custom parameters

Each module is defined via a `ModuleFactory` interface, which includes metadata, supported color spaces, expected return types, and a handler function that contains the actual transformation logic.

The central `Module` class in `@pyxe/core` provides all necessary capabilities to:

- register new modules using `_register( id, factory )`
- safely access or remove registered modules
- apply any registered module using `apply( id, color, ...args )`
- automatically bind selected modules as methods on `Color` instances

This system is intentionally kept lean and modular to allow third-party and community-developed modules to plug into the ecosystem with minimal effort.

**This class is not typically used directly by consumers of the library.**

## Typical Workflow

This design enables rich and composable operations while preserving a clean separation between core logic and optional features.

**(1)** - A module is defined using the `ModuleFactory` interface.  
**(2)** - On load, it registers itself via `module._register( … )`.  
**(3)** - If `exposeAsMethod` is enabled, it becomes available as a direct method on all `Color` instances.  
**(4)** - You can then apply the module via `color.<method>()` or `module.apply( … )`.

## Module Factory

New modules are described via the `ModuleFactory`, an interface that provides essential information about the module itself. The minimum information includes the module ID (unique name), the called handler function and supported color spaces. In addition, things such as metadata, the handler's return value and default options can be defined.

```ts
interface ModuleFactory {
  id: string;
  handler: ( ...args: any [] ) => any;
  spaces: ColorSpaceID[];
  options?: Record<string, any>;
  exposeAsMethod?: boolean;
  multiInput?: boolean;
  returnType?: string;
  meta?: Record<string, any>
}
```

## Methods

### `_register( id, factory )`

```ts
_register (
  id: string,
  factory: ModuleFactory
) : void
```

Registers a new module by ID. If the module's `exposeAsMethod` flag is set to true it is automatically exposed on the Color instance via `ColorMethodRegistry`.

@param `id` - Unique identifier for the module  
@param `factory` - Factory object implementing the module definition  
@throws Error if a module with the same ID is already registered

### `_unregister( id )`

```ts
_unregister (
  id: string
) : void
```

Unregisters a module, including its `Color` method binding. If the module is not registered, an error is thrown.

@param `id` - Module ID to remove  
@throws Error if the module does not exist

### `has( id )`

```ts
has (
  id: string
) : boolean
```

Checks if a module with the given ID is registered.

@param `id` - The module ID to look up  
@returns `true` if the module is registered, `false` otherwise

### `check( id )`

```ts
check (
  id: string
) : boolean
```

Ensures a module is registered, or throws.

@param `id` - Module ID to check  
@returns `true` if the module exists  
@throws Error if the module is not registered

### `getModules()`

```ts
getModules () : string[]
```

Returns a list of all registered module IDs.

@returns An array of registered module identifiers

### `getMeta( id )`

```ts
getMeta (
  id: string
) : any
```

Retrieves optional meta-information associated with a module. Returns `undefined` if no metadata is defined.

@param `id` - Module ID  
@returns The `meta` field from the module factory, if defined  
@throws Error if the module is not registered

### `apply( id, input, ...args )`

```ts
apply (
  id: string,
  input: ColorObject,
  ...args: any[]
) : ColorObject | ColorObject[] | any
```

Applies a registered module's logic to the input color object and optional arguments. Modules are responsible for input validation and must adhere to the expected behavior defined in their `ModuleFactory.handler`.

@param `id` - Module ID  
@param `input` - The color object to be processed  
@param `args` - Additional arguments forwarded to the module handler  
@returns Any result returned by the module handler, e.g. `ColorObject`, `array`, or `value`  
@throws Error if the module fails to execute or throws internally

## Singleton Export

```ts
export const module = new Module ();
```

The singleton instance used throughout the `pyxe` framework. Handles the dynamic registration of loaded modules, applies their handler functions called by the `Color` class and performs checks if modules are registered.