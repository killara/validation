
declare class Validation {

  constructor(context?: Validation.Context);

  validate(params: Validation.Params, rules: Validation.Rules, messages: Validation.Messages): Promise<Validation.Error[]>;

  addRule(name: string, ruleFunc: Validation.RuleFunc): void;

  addMessage(name: string, message: string): void;

}

declare namespace Validation {
  /**
   * Validation context parameter that can be used in custom rule
   */
  export interface Context {
    [contextKey: string]: any;
  }

  export interface Params {
    [fieldName: string]: any;
  }

  export interface Rules {
    [fieldName: string]: string | Array<any> | Object;
  }

  export interface Messages {
    [fieldName: string]: string | Array<any> | Object;
  }

  export interface Error {
    code: string;
    field: string;
    message: string;
  }

  export type RuleFunc = (field: string) => (context: Object) => (params: Object) => boolean;

}

export = Validation;