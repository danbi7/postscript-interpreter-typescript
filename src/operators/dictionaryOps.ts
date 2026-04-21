import { DictionaryStack } from "../core/DictionaryStack";
import { OperandStack } from "../core/OperandStack";
import { PsObject } from "../types/PsObject";
import { PsDictionary } from "../types/PsObject";

// Command #19: Creates a dictionary with given capacity
export const dict = (opStack: OperandStack): void => {
    const capacityObj = opStack.pop();

    if (capacityObj.type !== 'number') {
        throw new Error("TypeCheck: dict capacity must be a number");
    }

    opStack.push({
        type: 'dict',
        value: {
            capacity: capacityObj.value as number,
            entries: new Map<string, PsObject>()
        }
    });
};

// Command #20: Returns length of string or dictionary size
export const lengthOp = (opStack: OperandStack): void => {
    const obj = opStack.pop();

    if (obj.type === 'dict') {
        const dict = obj.value as PsDictionary;
        opStack.push({ type: 'number', value: dict.entries.size });
    } else if (obj.type === 'string') {
        opStack.push({ type: 'number', value: (obj.value as string).length });
    } else {
        throw new Error("TypeCheck: length requires dict or string");
    }
};

// Command #21: Returns dictionary capacity
export const maxlength = (opStack: OperandStack): void => {
    const obj = opStack.pop();

    if (obj.type !== 'dict') {
        throw new Error("TypeCheck: maxlength requires a dict");
    }

    const dict = obj.value as PsDictionary;
    opStack.push({ type: 'number', value: dict.capacity });
};

// Command #22: Pushes dictionary onto dictionary stack
export const begin = (opStack: OperandStack, dictStack: DictionaryStack): void => {
    const obj = opStack.pop();

    if (obj.type !== 'dict') {
        throw new Error("TypeCheck: begin requires a dict");
    }

    dictStack.push(obj.value as PsDictionary);
};

// Command #23: Pops dictionary stack (cannot remove base dict)
export const end = (opStack: OperandStack, dictStack: DictionaryStack): void => {
    if (dictStack.length() <= 1) {
        throw new Error("Cannot pop base dictionary");
    }
    dictStack.pop();
};

// Command #24: Defines a key-value pair in top dictionary
export const def = (opStack: OperandStack, dictStack: DictionaryStack): void => {
    const value = opStack.pop();
    const keyObj = opStack.pop();

    if (keyObj.type !== 'name') {
        throw new Error("TypeCheck: def key must be a name");
    }

    const key = keyObj.value as string;

    dictStack.define(keyObj.value as string, value);
};