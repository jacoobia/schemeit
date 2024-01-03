![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)

# SchemeIt

A lightweight express-js request payload validator, originally written for my personal projects and separated out into its own package for easier use.
Schemeit will check individual elements against their chosen validators, ensure all non-optional elements are present in a payload and can also optionally enforce `noExtraElements` to prevent bloated payloads.

## Install

```
npm install schemeit
```

## Usage

The following is a basic example usage of schemeit to build a validator middleware for an endpoint:

```
import express from "express";
import { NumberValidator, StringValidator, validator } from 'schemeit';

const app = express();

const testValidator = validator({
  name: StringValidator(),
  age: NumberValidator.optional()
});

app.post('/test', testValidator, async (request: Request, response: Response) => {
  response.status(200).json({ message: 'Success!' });
});

app.listen(3000);

```

You can also use the exported function `createValidator` to create your own validation function with custom rules like so:

```
const SpecificStringValidator: ValidationFunction = createValidator((object: unknown) => {
  return object === 'foo' || object === 'bar';
});
```

## Validator Options

| Option          | Description                                                                                          |
| --------------- | ---------------------------------------------------------------------------------------------------- |
| noExtraElements | Rejects payloads with elements that do not exist in the validator schema                             |
| errorListName   | Sets the name of the error list returned by the validator middleware, by default it is just `errors` |
