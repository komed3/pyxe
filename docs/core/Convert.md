# Color Space Conversion Utility

The `Convert` class is responsible for transforming color objects between color spaces using the internal `ConversionGraph`. It is a central component of the `pyxe` core system and supports:

- Fallback conversions (e.g., try `RGB`, then `HSL`, etc.)
- Strict vs. tolerant error handling
- Batch conversions
- Integrated tracing when enabled

**This class is not typically used directly by consumers of the library.** Color space conversions are performed directly via the central API using `Color.convert()` or used internally by some modules.

## Methods

### `convert( input, target )`

```ts
convert (
  input: ColorObject,
  target: ColorSpaceID | ColorSpaceID[]
) : ColorObject | undefined
```

Attempts to convert a single color object to the specified color space or the first successful match from a list of fallbacks.

@param `input` - The source color object  
@param `target` - The target color space ID or an array of fallback space IDs  
@returns The converted color object, or undefined if all targets fail  
@throws Will rethrow the last encountered error if all attempts fail

### `convertMany( input, target )`

```ts
convertMany (
  input: ColorObject[],
  target: ColorSpaceID | ColorSpaceID[]
) : ColorObject[]
```

Batch version of `.convert()`. Converts each color in the array using the same target logic.

@param `input` - Array of source color objects  
@param `target` - A single or list of fallback target color space IDs  
@returns An array of converted color objects

### `tryConvert( input, target [, strict = false ] )`

```ts
tryConvert (
  input: any,
  target: ColorSpaceID | ColorSpaceID[],
  strict: boolean = false
) : ColorObject | unknown
```

Fault-tolerant version of `.convert()`. Returns the original input if conversion fails and `strict` is set to `false`.

@param `input` - The color object to convert  
@param `target` - The target or list of fallback target spaces  
@param `strict` - If `true`, throws on failure; otherwise returns original input  
@returns The converted color object or the original input

### `tryConvertMany( input, target [, strict = false ] )`

```ts
tryConvertMany (
  input: any | any[],
  target: ColorSpaceID | ColorSpaceID[],
  strict: boolean = false
) : ColorObject[] | ColorObject | unknown
```

Like `.tryConvert()`, but supports single or multiple values. If input is an array, each element is processed separately.

@param `input` - The color object or array of objects to convert  
@param `target` - The target or list of fallback target spaces  
@param `strict` - If `true`, throws on failure; otherwise returns unchanged input(s)  
@returns Converted object(s) or the original input(s)

## Singleton Export

```ts
export const convert = new Convert ( conversionGraph );
```

This instance is used throughout the `pyxe` framework to convert one color space to another. Once initialized, the main instance of `ConversionGraph` will be handed over.