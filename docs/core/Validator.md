# Color Object Validator

The `Validator` class is a utility that enables standardized validation of color objects for any registered color space within the `@pyxe/core` module. It leverages the central `ColorSpace` registry to access validator functions defined by individual color spaces.

Features are:

- Delegates validation to space-specific handler functions registered in `ColorSpace`
- Throws structured errors for invalid input
- Supports boolean validation checks without throwing
- Ensures all `ColorObject` instances are well-formed and normalized

By encapsulating all validation logic in one place, the system remains consistent, extensible, and decoupled from specific implementations.

## Internals

The Validator class delegates all actual parsing logic to the `validator` handler function of each registered `ColorSpaceFactory`. It operates in two modes:

- `validate(…)` – Returns the well-formed ColorObject
- `try(…)` – Boolean check without throwing

## Methods

### `validate( space, input )`

```ts
static validate (
  space: ColorSpaceID,
  input: ColorObject
) : ColorObject
```

Validates the input color object against the specified color space using its registered validator.

@param `space` - The ID of the color space to validate against (e.g., `'RGB'`, `'Lab'`)  
@param `input` - The raw color object to be validated  
@returns A validated `ColorObject` representing the input  
@throws If validation fails or the color space is unknown

### `try( space, input )`

```ts
static try (
  space: ColorSpaceID,
  input: ColorObject
) : boolean
```

Performs a non-throwing validation test. Returns a boolean indicating whether the input would pass validation.

@param `space` - The ID of the color space to validate against (e.g., `'RGB'`, `'Lab'`)  
@param `input` - The raw color object to be validated  
@return `true` if validation is successful, `false` if not