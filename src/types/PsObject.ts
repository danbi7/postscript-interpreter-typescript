export type PsValue =
  | number
  | string
  | boolean
  | PsObject[]        // procedure body
  | PsDictionary;

export type PsObject =
  | { type: 'number'; value: number }
  | { type: 'string'; value: string }
  | { type: 'boolean'; value: boolean }
  | { type: 'name'; value: string }
  | { type: 'executable_name'; value: string }
  | { type: 'procedure'; value: PsObject[]; staticLink: PsDictionary[] }
  | { type: 'dict'; value: PsDictionary }
  | { type: 'open_proc'; value: null }
  | { type: 'close_proc'; value: null };

export interface PsDictionary {
  capacity: number;
  entries: Map<string, PsObject>;
}