import { basename } from "path";

export default class EnvError extends Error {
    constructor(missingEnvValue: string, directory: string) {
        super(`.env value ${missingEnvValue} not found in ${basename(directory)}.`);
    }
}
