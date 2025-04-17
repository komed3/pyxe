# Color Library API

The `ColorLib` class provides access to external color libraries, such as RAL or HTML named colors. It supports lazy loading of sources, metadata filtering, and integrated conversion to preferred color spaces. Color libraries are registered via the `ColorLibRegistry` and exposed through a singleton-based access pattern.

Features include:

- singleton access to library instances
- lazy loading of source modules
- entry lookup by ID or metadata
- conversion to preferred color spaces
- metadata filtering and querying

By abstracting color libraries into a central API, the system remains modular and supports on-demand loading of color datasets.

**Do not instantiate `ColorLib` manually. Use `ColorLib.getInstance()` instead.**

## Usage

Although typically used via `Color.fromLib()`, the `ColorLib` class can be used manually for advanced lookups or conversions.

Access libraries using the `Color` class:

```ts
import { Color } from 'pyxe';

// This loads only the classic set (from autoLoad)
const color = await Color.fromLib( 'RAL', '3020' );

// This explicitly loads all three sources
const designColor = await Color.fromLib( 'RAL', 'H270L30C25', {
    sources: [ 'classic', 'effect', 'design' ]
} );
```

or manually:

```ts
import { ColorLib } from '@pyxe/core';

const lib = ColorLib.getInstance( 'RAL', [ 'effect' ] );
const color = await lib.getColor( '120-5', [ 'RGB', 'HEX' ] );
```

## Auto-loading Sources

Color libraries can optionally define an `autoLoad` array in their registration metadata. This specifies which `sources` should be loaded automatically when the user does not provide a specific list.

This mechanism helps improve performance by avoiding unnecessary loading of large datasets—particularly useful in large collections such as RAL Design.

**If no sources are provided by the user and no `autoLoad` is defined, all sources will be loaded by default.**

## Internals

### `_loadSource( source )`

```ts
private async _loadSource (
  source: string
) : Promise<void>
```

Loads and caches a specific source if it hasn't been loaded yet.

@param `source` - The source key defined in the factory
@throws If the source cannot be resolved

### `_ensureLoaded( [ sources ] )`

```ts
private async _ensureLoaded (
  sources?: string[]
) : Promise<void>
```

Ensures that all specified or available sources are loaded. By default, the sources defined with `autoLoad` or all.

@param `sources` - Optional list of sources to load

### `_getColor( colorID [, sources ] )`

```ts
private async _getColor (
  colorID: string,
  sources?: string[]
) : Promise<ColorLibEntry | undefined>
```

Retrieves a color entry by its ID.

@param `colorID` - The unique color identifier (e.g., `RAL 3020`)  
@param `sources` - Optional sources to search in  
@returns Matching color entry or undefined

## Methods

### `getInstance( id [, sources ] )`

```ts
static getInstance (
  id: string,
  sources?: string[]
) : ColorLib
```

Returns a singleton instance of the color library with the given ID.

@param `id` - The registered library identifier  
@param `sources` - Optional array of sources to preload  
@returns A `ColorLib` instance for the given ID

### `destroyInstance( id )`

```ts
static destroyInstance (
  id: string
) : void
```

Destroys the singleton instance for a given library.

@param `id` – The library ID to destroy

### `getColor( colorID [, preferredSpaces [, options ] ] )`

```ts
async getColor (
  colorID: string,
  preferredSpaces?: ColorSpaceID[],
  options?: {
    sources?: string[],
    strict?: boolean,
    tryConvert?: boolean
  }
) : Promise<ColorObject | undefined>
```

Retrieves a converted ColorObject from the library entry with the specified ID.

@param `colorID` - Entry ID within the library  
@param `preferredSpaces` - Ordered list of preferred color spaces  
@param `options.sources` - Optional subset of sources to search in  
@param `options.strict` - Only use exact matches (no conversion)  
@param `options.tryConvert` - Attempt conversion if no preferred match exists  
@returns A converted `ColorObject` or undefined if not found

### `getColorEntry( colorID [, sources ] )`

```ts
async getColorEntry (
  colorID: string,
  sources?: string[]
) : Promise<ColorLibEntry | undefined>
```

Returns the raw entry object for the given ID.

@param `colorID` - The entry identifier  
@param `sources` - Optional list of sources to restrict the search  
@returns A `ColorLibEntry` if found

### `list( [ sources ] )`

```ts
async list (
  sources?: string[]
) : Promise<ColorLibList>
```

Returns all entries in the library, optionally filtered by source.

@param `sources` - Optional list of source IDs  
@returns An object map of all available entries

### `match( query [, sources ] )`

```ts
async match (
  query: string,
  sources?: string[]
) : Promise<ColorLibList>
```

Returns entries whose name or label matches the provided string.

@param `query` - The search string to match against  
@param `sources` - Optional source filter  
@returns A map of matching entries

### `filter( tag [, sources ] )`

```ts
async filter (
  tag: string,
  sources?: string[]
) : Promise<ColorLibList>
```

Returns entries that include the given tag in their metadata.

@param `tag` - Metadata tag to filter by  
@param `sources` - Optional source filter  
@returns A filtered list of entries

### `getSources()`

```ts
getSources () : string[]
```

Returns the list of all declared sources in the library.

@returns Array of source identifiers

### `hasSource( source [, loaded = false ] )`

```ts
hasSource (
  source: string,
  loaded: boolean = false
) : boolean
```

Checks whether a source is available (and optionally loaded).

@param `source` - The source identifier  
@param `loaded` - If `true`, only returns `true` if the source is loaded  
@returns `true` if source exists (and optionally loaded)

## ColorLibRegistry

The `ColorLibRegistry` manages all registered libraries and provides metadata access.

### `_register( id, factory )`

```ts
_register (
  id: string,
  factory: ColorLibFactory
) : void
```

Registers a new color library factory.

@param `id` - The library identifier  
@param `factory` - The factory callback used to load the library

### `_unregister( id )`

```ts
_unregister (
  id: string
) : void
```

Removes the library and its associated factory from the registry.

@param `id` - Library identifier

### `has( id )`

```ts
has (
  id: string
) : boolean
```

Checks whether the library is registered.

@param `id` - Library identifier  
@returns `true` if registered, `false` otherwise

### `check( id )`

```ts
check (
  id: string
) : boolean
```

Validates the presence of the library and throws an error if missing.

@param `id` - Library identifier  
@returns `true` if registered  
@throws If the ID is not registered

### `get( id [, safe = true ] )`

```ts
get (
  id: string,
  safe: boolean = true
) : ColorLibFactory | undefined
```

Returns the factory function for the given ID.

@param `id` - Library identifier  
@param `safe` - If `true` (default), will throw on unknown ID  
@returns The factory function, or undefined if not found

### `getLibraries()`

```ts
getLibraries () : string[]
```

Returns a list of all registered library identifiers.

### `getMeta( id )`

```ts
getMeta (
  id: string
) : any
```

Returns metadata associated with the library, if available.

@param `id` - Library identifier  
@returns Arbitrary metadata object (if available)

Singleton Export

```ts
export const colorLibRegistry = new ColorLibRegistry ();
```

The singleton instance used throughout the `pyxe` framework. Used to register or query color libraries globally. Instantiated color libraries are cached and can be reused via `ColorLib.getInstance()` method.

## Notes

- Library sources must be defined via `async` factory functions.
- Entries include a `.spaces` map of known color space representations.
- Entry metadata may include tags, labels, and custom data used for filtering and matching.
- Conversion is handled through the central conversion graph if `tryConvert` is enabled.