
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

## Features

**Primitive Type Validation**: Validate data against primitive types such as `string`, `number`, `boolean`, etc. 
```
{ name: 'string', age: 'number' }
```
**Union Types**: Support for union types, allowing a value to match one of several specified types. 
```
{ status: 'string|"active"|"inactive"|null' }
```
**Optional Type Validation**: Support for optional types, allowing validation of data that may or may not be present. 
```
{ age: 'number?' }
```
**Complex Object Validation**: Deep validation of nested objects with specified type structures. 
```
{
    name: 'string',
    address: { street: 'string', city: 'string', postalCode: 'string{/^[0-9]{5}$/}' }
    phones: '[string]'
}
```
**Array Type and Length Validation**: Validate arrays, including type constraints for elements and optional length constraints. 
```
{ numbers: 'array<number>{2,4}' }
```
**Regular Expression String Validation**: Use regular expressions to validate string patterns. 
```
{ code: 'string{/[A-Z]{3}-[0-9]{3}/}' }
```
**Custom Function Validation**: Define custom validation logic for more complex scenarios.
```
{ palindrome: (value) => value === value.split('').reverse().join('') }
```
