import { OperandStack } from "../core/OperandStack";

// Command #25: Returns length of string 
export const length = (opStack: OperandStack): void => {
    if (opStack.length() < 1) {
        throw new Error("StackUnderflow: length requires one operand ");
    }
    const obj = opStack.pop();

    if (obj.type !== 'string') {
        throw new Error("TypeCheck: length requires a string ");
    }

    opStack.push({
        type: 'number',
        value: (obj.value as string).length
    });
};

// Command #26: Returns string[index] 
export const get = (opStack: OperandStack): void => {
    if (opStack.length() < 2) {
        throw new Error("StackUnderflow: get requires string and index ");
    }
    const index = opStack.pop();
    const strObj = opStack.pop();

    if (strObj.type !== 'string' || index.type !== 'number') {
        throw new Error("TypeCheck: get requires string and number ");
    }

    const val = (strObj.value as string).charCodeAt(index.value as number);

    // PostScript 'get' on strings returns the numeric character code 
    opStack.push({ type: 'number', value: val });
};

// Command #27: Returns string[index..index+count-1] 
export const getinterval = (opStack: OperandStack): void => {
    if (opStack.length() < 3) {
        throw new Error("StackUnderflow: getinterval requires string, index, and count ");
    }
    const count = opStack.pop();
    const index = opStack.pop();
    const strObj = opStack.pop();

    if (strObj.type !== 'string' || index.type !== 'number' || count.type !== 'number') {
        throw new Error("TypeCheck: Invalid types for getinterval ");
    }

    const start = index.value as number;
    const len = count.value as number;
    const substring = (strObj.value as string).substring(start, start + len);

    opStack.push({ type: 'string', value: substring });
};

// Command #28: Replaces string1[index..] with string2 
export const putinterval = (opStack: OperandStack): void => {
    if (opStack.length() < 3) {
        throw new Error("StackUnderflow: putinterval requires string1, index, and string2 ");
    }
    const str2 = opStack.pop();
    const index = opStack.pop();
    const str1 = opStack.pop();

    if (str1.type !== 'string' || index.type !== 'number' || str2.type !== 'string') {
        throw new Error("TypeCheck: Invalid types for putinterval ");
    }

    const s1 = str1.value as string;
    const idx = index.value as number;
    const s2 = str2.value as string;

    // Implementation note: Strings in TS are immutable, but PS strings are mutable
    // I update the value property of the original PsObject reference
    str1.value = s1.substring(0, idx) + s2 + s1.substring(idx + s2.length);
};