export type DataTypeValidator = {
  validate: (object: unknown) => boolean;
  optional?: boolean;
};

export type ValidationError = Record<string, string>;
export type Payload = Record<string, any> | null;

export const StringValidator: DataTypeValidator = {
  validate(object: unknown): object is string {
    return typeof object === 'string';
  }
};

export const NumberValidator: DataTypeValidator = {
  validate(object: unknown): object is number {
    return typeof object === 'number';
  }
};

export const BooleanValidator: DataTypeValidator = {
  validate(object: unknown): object is boolean {
    return typeof object === 'boolean';
  }
};

export const ObjectValidator: DataTypeValidator = {
  validate(object: unknown): object is Record<string, unknown> {
    return typeof object === 'object' && object !== null && !Array.isArray(object);
  }
};
