import { validateLogin } from "../../src/Login/login";

describe('Login', () => {
    let username = 'tsnicholas';
    let password = 'garfield';

    it('passing test', () => {
        expect(validateLogin(username, password)).toBe(true);
    });

    it('failing test', () => {
        expect(validateLogin('tedbundy', 'aaaaaaah')).toBe(false);
    })
})
