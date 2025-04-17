# Core Module Manager

The `pyxe` framework features a **modular and dynamic computation system** designed to extend color operations in a highly scalable and maintainable way. This system allows developers to implement advanced color transformations, generate gradients, invert colors, calculate contrast, and more—without embedding any of that logic directly in the core framework.

Modules are implemented as isolated, self-contained logic units that are:

- defined independently, often as standalone packages (e.g., `@pyxe/invert`, `@pyxe/gradient`, etc.)
- dynamically registered at runtime through the centralized `Module` class
- optionally exposed as callable methods on `Color` instances (e.g., `color.invert()`), depending on the module definition
- fully responsible for input validation, parameter handling, and compatible color space enforcement

Each module follows a strict structure via the `ModuleFactory` interface, which defines:

- a unique identifier
- transformation methods (`ModuleMethodFactory[]`) with optional binding instructions
- supported color spaces
- optional metadata
- a transformation `handler` for each method

The central `Module` class in `@pyxe/core` manages the module lifecycle and provides functionality to:

- **register** modules dynamically using `_register( id, factory )`
- **unregister** modules and their associated methods
- **apply** module methods directly using `apply( key, color, ...args )`
- **bind** or **unbind** module methods on the `Color` class using an internal registry
- **inspect** available modules and their methods for introspection and tooling

This architecture is explicitly designed to be lightweight, decoupled, and extensible—making it easy for third-party or community-driven modules to integrate seamlessly into the `pyxe` ecosystem.

**This class is not typically used directly by consumers of the library.**

## Typical Workflow

This design enables rich and composable operations while preserving a clean separation between core logic and optional features.

**(1)** - A module is defined using the `ModuleFactory` interface.  
**(2)** - On load, it registers itself via `module._register( … )`.  
**(3)** - Registers methods and binds them directly to the `Color` class, if so defined.  
**(4)** - Methods can be applied via `color.<method>()` or in general `module.apply( … )`.

## Module Factory

New modules are described via the `ModuleFactory`, an interface that provides essential information about the module itself. The minimum information includes the module ID (unique name) and the array of handler functions with their supported color spaces. In addition, metadata can be added.

```ts
type ModuleMethodHandler = (
  input: ColorObject,
  ...args: any[]
) => ColorObject | ColorObject[] | any;

interface ModuleMethodFactory {
  id: string;
  handler: ModuleMethodHandler;
  spaces: ColorSpaceID[];
  bindAs?: string;
  meta?: Record<string, any>
}

interface ModuleFactory {
  id: string;
  methods: ModuleMethodFactory[],
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

Registers a module and its associated methods. Throws an error if the module ID already exists. This method is intended to be called by modules during setup.

@param `id` - Unique module identifier  
@param `factory` - Module definition (methods, meta info, etc.)  
@throws If the module is already declared

### `_unregister( id )`

```ts
_unregister (
  id: string
) : void
```

Unregisters a module, including its Color method binding. If the module is not registered, an error is thrown. This method is intended for internal use, e.g., in testing or plugin unloading.

@param `id` - ID of the module to remove

### `_registerMethods( id [, bind = true ] )`

```ts
_registerMethods (
  id: string,
  bind: boolean = true
) : void
```

Registers all methods of a given module and binds them to the `Color` class if specified.

@param `id` - Module ID  
@param `bind` - Whether to bind methods to `ColorMethodRegistry`  
@throws If the module is already declared

### `_unregisterMethods( id )`

```ts
_unregisterMethods (
  id: string
) : void
```

Unbinds all methods associated with a module.

@param `id` - Module ID

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

### `get( id [, safe = true ] )`

```ts
get (
  id: string,
  safe: boolean = true
) : ModuleFactory | undefined
```

Retrieves a module factory by its ID.

@param `id` - Module ID to retrieve  
@param `safe` - Whether to throw an error if the module does not exist (default: `true`)  
@returns The factory if found or `undefined` in safe mode

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

### `hasMethod( key )`

```ts
hasMethod (
  key: string
) : boolean
```

Checks whether a module method is registered.

@param `id` - Method key in the format `<moduleId>::<methodId>`  
@returns `true` if registered

### `checkMethod( key )`

```ts
checkMethod (
  key: string
) : boolean
```

Ensures a module method is registered. Throws an error if not.

@param `id` - Method key  
@returns `true` if check passes  
@throws If the method is not registered

### `getMethods( [ filter ] )`

```ts
getMethods (
  filter?: string
) : string[]
```

Returns all registered method keys, optionally filtered by string through regex.

@param `filter` - Optional string (`regex`) to filter method keys  
@returns Array of (filtered) method keys

### `getMethodMap()`

```ts
getMethodMap () : Record<string, string[]>
```

Returns a map of all registered methods grouped by module ID.

@returns Object with keys as module IDs and values as arrays of method names

### `getMethodMeta( key )`

```ts
getMethodMeta (
  key: string
) : any
```

Returns metadata associated with a specific method.

@param `key` - Method key `<moduleId>::<methodId>`  
@returns Metadata object or undefined

### `apply( id, input, ...args )`

```ts
apply (
  key: string,
  input: ColorObject,
  ...args: any[]
) : ColorObject | ColorObject[] | any
```

Applies a registered method's logic to the input color object and optional arguments. Module methods are responsible for input validation and must adhere to the expected behavior defined in their `ModuleMethodFactory.handler`.

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