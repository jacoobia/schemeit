export type DataTypeValidator = {
  validate: (object: unknown) => boolean;
  optional?: boolean;
};

export type ValidatorOptions = {
  noExtraElements?: boolean;
  errorListName?: string;
};

export type ValidationFunction = (() => DataTypeValidator) & { optional: () => DataTypeValidator };
export type ValidationError = Record<string, string>;
export type Payload = Record<string, any> | null;
