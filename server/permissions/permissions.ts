import { User } from "../types";

export function isAdminOrOwner(user: User, accountId: number) {
    return user.role === "admin" || accountId === user.id;
}

export function isAdminCoachOrOwner(user: User, accountId: number) {
    return user.role === "admin" || user.role === "coach" || accountId === user.id;
}

export function isOwner(user: User, accountId: number) {
    return accountId === user.id;
}
