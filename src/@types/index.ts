export type ElementValidator = {
  validate: (object: unknown) => boolean;
  optional?: boolean;
  message?: string;
};

export type ValidatorOptions = {
  noExtraElements?: boolean;
  errorListName?: string;
};

export type ValidatorFunction = (() => ElementValidator) & { optional: () => ElementValidator };
export type ValidationError = Record<string, string>;
export type Payload = Record<string, any> | null;
