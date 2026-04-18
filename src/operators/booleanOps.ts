import { OperandStack } from "../core/OperandStack";
import { PsObject } from "../types/PsObject";

// Helper to push boolean results
const pushBool = (stack: OperandStack, val: boolean) => {
    stack.push({ type: 'boolean', value: val });
};

// Command #29: eq (Tests equal) 
export const eq = (opStack: OperandStack): void => {
    const v2 = opStack.pop();
    const v1 = opStack.pop();
    pushBool(opStack, v1.value === v2.value);
};

// Command #30: ne (Tests not equal) 
export const ne = (opStack: OperandStack): void => {
    const v2 = opStack.pop();
    const v1 = opStack.pop();
    pushBool(opStack, v1.value !== v2.value);
};

// Command #31: ge (Greater than or equal) 
export const ge = (opStack: OperandStack): void => {
    const v2 = opStack.pop();
    const v1 = opStack.pop();
    pushBool(opStack, (v1.value as any) >= (v2.value as any));
};

// Command #32: gt (Greater than) 
export const gt = (opStack: OperandStack): void => {
    const v2 = opStack.pop();
    const v1 = opStack.pop();
    pushBool(opStack, (v1.value as any) > (v2.value as any));
};

// Command #33: le (Less than or equal) 
export const le = (opStack: OperandStack): void => {
    const v2 = opStack.pop();
    const v1 = opStack.pop();
    pushBool(opStack, (v1.value as any) <= (v2.value as any));
};

// Command #34: lt (Less than) 
export const lt = (opStack: OperandStack): void => {
    const v2 = opStack.pop();
    const v1 = opStack.pop();
    pushBool(opStack, (v1.value as any) < (v2.value as any));
};

// Command #35: and (Logical or bitwise AND) 
export const and = (opStack: OperandStack): void => {
    const v2 = opStack.pop();
    const v1 = opStack.pop();
    if (typeof v1.value === 'boolean' && typeof v2.value === 'boolean') {
        pushBool(opStack, v1.value && v2.value);
    } else {
        opStack.push({ type: 'number', value: (v1.value as number) & (v2.value as number) });
    }
};

// Command #36: or (Logical or bitwise OR) 
export const or = (opStack: OperandStack): void => {
    const v2 = opStack.pop();
    const v1 = opStack.pop();
    if (typeof v1.value === 'boolean' && typeof v2.value === 'boolean') {
        pushBool(opStack, v1.value || v2.value);
    } else {
        opStack.push({ type: 'number', value: (v1.value as number) | (v2.value as number) });
    }
};

// Command #37: not (Logical or bitwise NOT) 
export const not = (opStack: OperandStack): void => {
    const v1 = opStack.pop();
    if (typeof v1.value === 'boolean') {
        pushBool(opStack, !v1.value);
    } else {
        opStack.push({ type: 'number', value: ~(v1.value as number) });
    }
};

// Command #38: true 
export const trueOp = (opStack: OperandStack): void => {
    pushBool(opStack, true);
};

// Command #39: false 
export const falseOp = (opStack: OperandStack): void => {
    pushBool(opStack, false);
};