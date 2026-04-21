import { OperandStack } from "../src/core/OperandStack";
import { PsObject } from "../src/types/PsObject";
import { print, popPrint, popPrintPs } from "../src/operators/ioOps";

describe("ioOps.ts Tests", () => {
    let opStack: OperandStack;
    let consoleSpy: jest.SpyInstance;
    let stdoutSpy: jest.SpyInstance;

    beforeEach(() => {
        opStack = new OperandStack();
        consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
        // print uses process.stdout.write (no newline, per PostScript spec)
        stdoutSpy = jest.spyOn(process.stdout, 'write').mockImplementation(() => true);
    });

    afterEach(() => {
        consoleSpy.mockRestore();
        stdoutSpy.mockRestore();
    });

    const createObj = (val: any, type: PsObject['type']): PsObject => ({
        type,
        value: val
    } as PsObject);

    describe("print", () => {
        it("should write string to stdout without newline (PostScript spec)", () => {
            opStack.push(createObj("Hello World", "string"));
            print(opStack);
            expect(stdoutSpy).toHaveBeenCalledWith("Hello World");
            expect(opStack.length()).toBe(0);
        });

        it("should throw error if top element is not a string", () => {
            opStack.push(createObj(123, "number"));
            expect(() => print(opStack)).toThrow("TypeCheck: print requires a string.");
        });
    });

    describe("popPrint (=)", () => {
        it("should log the raw value of any object type", () => {
            opStack.push(createObj(true, "boolean"));
            popPrint(opStack);
            expect(consoleSpy).toHaveBeenCalledWith("true");
            
            opStack.push(createObj(500, "number"));
            popPrint(opStack);
            expect(consoleSpy).toHaveBeenCalledWith("500");
        });

        it("should throw StackUnderflow if empty", () => {
            expect(() => popPrint(opStack)).toThrow("StackUnderflow: = requires one operand.");
        });
    });

    describe("popPrintPs (==)", () => {
        it("should format strings with parentheses", () => {
            opStack.push(createObj("test", "string"));
            popPrintPs(opStack);
            expect(consoleSpy).toHaveBeenCalledWith("(test)");
        });

        it("should format names with a leading slash", () => {
            opStack.push(createObj("myVar", "name"));
            popPrintPs(opStack);
            expect(consoleSpy).toHaveBeenCalledWith("/myVar");
        });

        it("should represent procedures as brackets", () => {
            opStack.push(createObj([], "procedure"));
            popPrintPs(opStack);
            expect(consoleSpy).toHaveBeenCalledWith("{ ... }");
        });

        it("should represent dictionaries with dict markers", () => {
            opStack.push(createObj({}, "dict"));
            popPrintPs(opStack);
            expect(consoleSpy).toHaveBeenCalledWith("<<dict>>");
        });

        it("should use standard string conversion for default types", () => {
            opStack.push(createObj(42, "number"));
            popPrintPs(opStack);
            expect(consoleSpy).toHaveBeenCalledWith("42");
        });
    });
});