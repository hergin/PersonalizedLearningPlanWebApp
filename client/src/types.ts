export interface Module {
    id: number,
    name: string,
    description: string,
    completion: number,
}

export interface Goal {
    id: number,
    name: string,
    description: string,
    is_complete: boolean,
    module_id: number
}

export interface User {
    email: string,
    accessToken: string,
    refreshToken: string,
}

export const emptyUser : User = { email: "", accessToken: "", refreshToken: "" };
