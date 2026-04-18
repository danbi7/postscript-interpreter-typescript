import { PsDictionary, PsObject } from "../types/PsObject";

export class DictionaryStack {
    private items: PsDictionary[] = []

    push(dict: PsDictionary): void {
        this.items.push(dict)
    }

    pop(): PsDictionary {
        if (this.isEmpty()){
            throw new Error("StackUnderFlow - Attempted to pop an empty stack.");
        }
        return this.items.pop()!;
    }

    isEmpty(): boolean {
        return this.items.length === 0;
    }

    lengh(): number {
        return this.items.length
    }

    define(key: string, value: PsObject): void {
        if(this.isEmpty()){
            throw new Error("No dictionary available.");
        }
        const currentDict = this.items[this.lengh() - 1];
        currentDict.entries.set(key, value);
    }

    lookup(key: string): PsObject | undefined {
        for (let i = this.lengh() - 1; i >= 0; i--){
            if(this.items[i].entries.has(key)){
                return this.items[i].entries.get(key);
            }
        }
        return undefined;
    }
}