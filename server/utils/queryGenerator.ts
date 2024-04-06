import { snakeCase } from "lodash";
import { Query, Table } from "../types";

type Value = string | number | boolean | Date;

export function generateInsertQuery<T extends object>(object: T, table: Table): Query {
    var beginningText = `INSERT INTO ${table}(`;
    var endingText = "VALUES (";
    var values : Value[] = [];
    Object.entries(object).forEach((element) => {
        const [name, value] = element;
        if(value === undefined || value === "" || Array.isArray(value)) return;
        beginningText = beginningText.concat(`${snakeCase(name)}, `);
        values.push(value);
        endingText = endingText.concat(`$${values.length}, `);
    });
    beginningText = beginningText.slice(0, beginningText.length - 2).concat(") ");
    endingText = endingText.slice(0, endingText.length - 2).concat(")");
    const finalText = beginningText.concat(endingText);
    return {text: finalText, values: values};
}

export function generateUpdateQuery<T extends object>(object: T, table: Table, key: string): Query {
    var text = `UPDATE ${table} SET `;
    var values : Value[] = [];
    var keyValue : any;
    Object.entries(object).forEach((element) => {
        const [name, value] = element;
        if(value === undefined || value === "" || Array.isArray(value)) return;
        if(snakeCase(name) === snakeCase(key)) {
            keyValue = value;
            return;
        }
        values.push(value);
        text = text.concat(`${snakeCase(name)} = $${values.length}, `);
    });
    values.push(keyValue);
    const finalText = text.slice(0, text.length - 2).concat(` WHERE ${key} = $${values.length}`);
    return {text: finalText, values: values};
}
