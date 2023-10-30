const USERNAME = 'tsnicholas';
const PASSWORD = 'garfield';

export function validateLogin(username, password) {
    return USERNAME === username && PASSWORD === password;
}
