export {};

declare global {
    namespace NodeJS {
        interface ProcessENV {
            POSTGRES_USER: string,
            POSTGRES_PASSWORD: string,
            POSTGRES_DATABASE: string,
            POSTGRES_PORT: number,
            POSTGRES_HOST: string,
            ACCESS_TOKEN_SECRET: string,
            REFRESH_TOKEN_SECRET: string,
            SERVICE: string,
            HOST: string,
            EMAIL_PORT: number,
            ACCOUNT_EMAIL: string,
            ACCOUNT_PASSWORD: string
        }
    }    
}
