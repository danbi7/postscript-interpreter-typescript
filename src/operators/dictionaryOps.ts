import { DictionaryStack } from "../core/DictionaryStack";
import { OperandStack } from "../core/OperandStack";
import { PsObject } from "../types/PsObject";
import { PsDictionary } from "../types/PsObject";

// Command #19:
export const dict = (opStack: OperandStack): void => {
    const capacityObj = opStack.pop();
    if (capacityObj.type !== 'number') {
        throw new Error("TypeCheck: dict capacity must be a number");
    }

    // Push a new dictionary object to the operand stack
    opStack.push({
        type: 'dict',
        value: {
            capacity: capacityObj.value as number,
            entries: new Map<string, PsObject>()
        }
    });
};

// Command #20:
export const lengthOp = (opStack: OperandStack): void => {
    const obj = opStack.pop();
    // length works on both strings and dicts [cite: 20, 25]
    if (obj.type === 'dict') {
        opStack.push({ type: 'number', value: (obj.value as PsDictionary).entries.size });
    } else if (obj.type === 'string') {
        opStack.push({ type: 'number', value: (obj.value as string).length });
    } else {
        throw new Error("TypeCheck: length requires dict or string");
    }
};

// Command #21:
export const maxlength = (opStack: OperandStack): void => {
    const obj = opStack.pop();
    if (obj.type !== 'dict') {
        throw new Error("TypeCheck: maxlength requires a dict");
    }
    opStack.push({ type: 'number', value: (obj.value as PsDictionary).capacity });
};

// Command #22:
export const begin = (opStack: OperandStack, dictStack: DictionaryStack): void => {
    const obj = opStack.pop();
    if (obj.type !== 'dict') {
        throw new Error("TypeCheck: begin requires a dict");
    }
    // Push the dictionary onto the dictionary stack
    dictStack.push(obj.value as PsDictionary);
};

// Command #23:
export const end = (dictStack: DictionaryStack): void => {
    // Pop the top dictionary from the dictionary stack
    dictStack.pop(); 
};

// Command #24:
export const def = (opStack: OperandStack, dictStack: DictionaryStack): void => {
    // def takes: key value -> - 
    const value = opStack.pop();
    const keyObj = opStack.pop();

    if (keyObj.type !== 'name') {
        throw new Error("TypeCheck: def key must be a name");
    }

    // Associates key and value in current (top) dict 
    dictStack.define(keyObj.value as string, value);
};