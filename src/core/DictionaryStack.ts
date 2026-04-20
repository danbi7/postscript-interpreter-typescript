import { PsDictionary, PsObject } from "../types/PsObject";

export class DictionaryStack {
    private items: PsDictionary[] = []

    constructor() {
        this.push({
            capacity: Infinity,
            entries: new Map<string, PsObject>()
        });
    }
    
    getStack(): PsDictionary[] {
        return [...this.items];
    }

    push(dict: PsDictionary): void {
        this.items.push(dict)
    }

    pop(): PsDictionary {
        if (this.items.length === 1) {
            throw new Error("Cannot pop the bottom dictionary.");
        }
        return this.items.pop()!;
    }

    peek(): PsDictionary {
        if (this.isEmpty()) {
            throw new Error("Dictionary stack is empty.");
        }
        return this.items[this.items.length - 1];
    }

    isEmpty(): boolean {
        return this.items.length === 0;
    }

    length(): number {
        return this.items.length
    }


    define(key: string, value: PsObject): void {
        if (this.isEmpty()) {
            throw new Error("No dictionary available.");
        }
        const currentDict = this.items[this.length() - 1];
        currentDict.entries.set(key, value);
    }

    lookupDynamic(key: string): PsObject | undefined {
        for (let i = this.length() - 1; i >= 0; i--) {
            if (this.items[i].entries.has(key)) {
                return this.items[i].entries.get(key);
            }
        }
        return undefined;
    }

    lookupStatic(key: string, staticLink: PsDictionary[]): PsObject | undefined {
        for (let i = staticLink.length - 1; i >= 0; i--) {
            if (staticLink[i].entries.has(key)) {
                return staticLink[i].entries.get(key);
            }
        }
        return undefined;
    }
}