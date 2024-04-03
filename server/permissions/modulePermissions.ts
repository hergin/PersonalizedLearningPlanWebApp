import { User, Module } from "../types";

export function canEditModule(user: User, module: Module) {
    return (
        user.role === "admin" || module.accountId === user.id
    );
}

export function canDeleteModule(user: User, module: Module) {
    return (
        user.role === "admin" || module.accountId === user.id
    );
}
