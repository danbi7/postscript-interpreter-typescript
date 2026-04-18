import { PsObject } from "../types/PsObject";

export class OperandStack {
    private items: PsObject[] = []

    push(item: PsObject): void {
        this.items.push(item)
    }

    pop(): PsObject {
        if (this.isEmpty()) {
            throw new Error("StackUnderFlow - Attempted to pop an empty stack.");
        }
        return this.items.pop()!;
    }

    peek(depth: number = 0): PsObject {
        const index = this.items.length - 1 - depth;
        if (index < 0) {
            throw new Error("StackUnderflow: Not enough elements on the stack.");
        }
        return this.items[index];
    }

    isEmpty(): boolean {
        return this.items.length === 0;
    }

    length(): number {
        return this.items.length
    }
}