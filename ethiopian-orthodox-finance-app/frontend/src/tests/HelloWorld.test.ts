import { describe, expect, it } from 'vitest';

describe('HelloWorld', () => {
    it('prints hello world', () => {
        expect('hello world!').toContain('hello');
    });
});