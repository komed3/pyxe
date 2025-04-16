# Directed Conversion Graph for Color Space Transformations

The `ConversionGraph` class is the central infrastructure for managing directed color space conversions within the `@pyxe/core` module. It maintains a graph of registered transformation steps between color spaces and resolves conversion paths dynamically and efficiently.

Each transformation is defined from one color space to another via a conversion handler. The graph supports multiple paths, performs shortest-path discovery using BFS, and caches results for performance.

This class allows `pyxe` to:

- Register one or multiple conversion handlers
- Unregister all paths from a source color space
- Dynamically resolve composite conversion functions
- Visualize the conversion tree
- Cache and reuse computed paths

**This class is not intended for direct use by application developers but is essential for the infrastructure behind color space conversions.**

## Methods

### `_register( source, target, handler )`

```ts
_register (
  source: ColorSpaceID,
  target: ColorSpaceID,
  handler: ConversionHandler
) : void
```

Registers a direct conversion from source to target using the provided handler.

@param `source` - Source color space ID  
@param `target` - Target color space ID  
@param `handler` - Conversion function from source to target

### `_registerMany( source, paths )`

```ts
_registerMany (
  source: ColorSpaceID,
  paths: ConversionPath[]
) : void
```

Registers multiple outbound conversion paths from a given source color space.

@param `source` - The common source color space  
@param `paths` - Array of `{ target, handler }` objects

### `_unregisterAll( source )`

```ts
_unregisterAll (
  source: ColorSpaceID
) : void
```

Unregister all conversion paths starting from a color space.

@param ``source` - The source color space ID

### `_flush()`

```ts
_flush () : void
```

Clears the internal cache of resolved conversion paths. Useful after (re-)registering conversions.

### `getFrom( source )`

```ts
getFrom (
  source: ColorSpaceID
) : ConversionPath[]
```

Returns all direct conversion paths starting from the given source color space.

@param `source` - The origin color space  
@return Array of direct conversion paths (or empty array)

### `findPath( source, target )`

```ts
findPath (
  source: ColorSpaceID,
  target: ColorSpaceID
) : ColorSpaceID[] | null
```

Finds the shortest conversion path between two color spaces using a breadth-first search.

@param `source` - Start color space  
@param `target` - Destination color space  
@return Array of `ColorSpaceID`s forming the conversion path, or `null` if no path is found

### `resolve( source, target )`

```ts
resolve (
  source: ColorSpaceID,
  target: ColorSpaceID
) : ConversionHandler
```

Constructs a composite conversion function by chaining all necessary handlers along the path between two color spaces.

@param `source` - Start color space  
@param `target` - Destination color space  
@return A function that transforms a `ColorObject` from `source` to `target`  
@throws If no valid path exists or an intermediate step is missing

### `describePath( source, target )`

```ts
describePath (
  source: ColorSpaceID,
  target: ColorSpaceID
) : string
```

Returns a human-readable string of the resolved path between two color spaces, using an arrow format.

@param `source` - Start color space  
@param `target` - End color space  
@return Path as a string like `"rgb → xyz → lab"` or `"n/a"` if no path exists

### `tree( root [, maxDepth = 99 ] )`

```ts
tree (
  root: ColorSpaceID,
  maxDepth: number = 99
) : string
```

Generates a visual representation of all reachable color spaces from the given root, in a tree-like format. Useful for debugging and documentation.

@param `root` - Starting color space  
@param `maxDepth` - Maximum tree depth to explore  
@return A formatted string showing the tree structure

## Singleton Export

```ts
export const conversionGraph = new ConversionGraph ();
```

This instance is used throughout the `pyxe` framework for registering and resolving conversions between color spaces.