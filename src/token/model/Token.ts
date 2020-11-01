import Express from "express";

export class Token {
    static getToken = (req: Express.Request): string => {
        if (req.headers.authorization && req.headers.authorization.split(" ")[0] === "Bearer")
            return req.headers.authorization.split(" ")[1];
        else
            return "";
    }
}