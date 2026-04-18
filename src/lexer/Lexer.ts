import { PsObject } from "../types/PsObject";

export class Lexer {
    static tokenize(input: string): PsObject[] {
        // Regex to handle: numbers, literal names (/x), and procedures ({})
        const tokens = input.match(/\{|\}|\[|\]|\/[^\s\[\]\{\}]+|[^\s\[\]\{\}]+/g) || [];
        return tokens.map(t => this.classify(t));
    }

    private static classify(token: string): PsObject {
        if (!isNaN(Number(token))) return { type: 'number', value: Number(token) };
        if (token === '{') return { type: 'open_proc', value: '{' };
        if (token === '}') return { type: 'close_proc', value: '}' };
        if (token === 'true') return { type: 'boolean', value: true };
        if (token === 'false') return { type: 'boolean', value: false };
        if (token.startsWith('/')) return { type: 'name', value: token.substring(1) };
        return { type: 'executable_name', value: token };
    }
}