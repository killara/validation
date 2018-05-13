
declare class Validation {

  constructor(context?: Validation.Context);

  validate(params: Validation.Params, rules?: Validation.Rules, messages?: Validation.Messages): Promise<Validation.Error[]>;

  addRule(name: string, ruleFunc: Validation.RuleFunc): void;

  addMessage(name: string, message: string): void;

}

declare namespace Validation {
  /**
   * Validation context parameter that can be used in custom rule
   */
  export interface Context {
    [contextKey: string]: any;
    options?: never;
  }

  export interface Params {
    [fieldName: string]: any;
  }

  export interface Rules {
    [fieldName: string]: Rule;
  }

  export interface Messages {
    [fieldName: string]: string;
  }

  export interface Error {
    code: string;
    field: string;
    message: string;
  }

  export interface ObjectRule {
    [ruleName: string]: Object;
  }

  export type RuleFunc = (field: string) => (context: Object) => (params: Object) => boolean;
  export type Rule = string | Array<any> | ObjectRule;

}

export = Validation;