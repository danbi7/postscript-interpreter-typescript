export type PsValue = 
  | number 
  | string 
  | boolean 
  | PsObject[]   // For procedures/arrays
  | PsDictionary;

export interface PsObject {
  // 'name' is the literal /x, 'executable_name' is the command x
  type: 'number' | 'string' | 'boolean' | 'name' | 'executable_name' | 'procedure' | 'dict' | 'open_proc' | 'close_proc';
  value: PsValue;
  // Required for Lexical Scoping: Stores the environment where the proc was defined
  staticLink?: Map<string, PsObject>[]; 
}

export interface PsDictionary {
  capacity: number; // Required 
  entries: Map<string, PsObject>;
}