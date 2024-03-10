
# TypeValidator

A tiny type validating library for my hobby projects.

## Disclaimer

This code was developed quickly and hacky, and may contain errors or unforeseen issues. Use it with caution and consider thoroughly. Please exercise caution when using this library in production environments as it may not have undergone extensive testing. Use it at your own discretion.

## Syntax
```js
function add(a, b) {
    const validation = TypeValidator.validate({ a: 'number', b: 'number' }, { a, b })
    if (!validation.success) {
        console.warn('incorrect add!')
        return Number.NaN;
    }
    return a + b;
}

function add_throw(a, b) {
    const validation = TypeValidator.validateAndThrow({ a: 'number', b: 'number' }, { a, b })
    return a + b; // <-- throws new Error
}

console.log(add(1, 3)) // 4
console.log(add(1, '3')) // <-- NaN
console.log(add_throw(1, '3')) // <-- Error
```