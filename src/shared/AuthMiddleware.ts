import Express from "express";
import JWT from "jsonwebtoken";
import {Token} from "@src/token/model/Token";
import { ResponseFactory } from "@src/shared/ResponseFactory";

export const AuthMiddleware = (
    req: Express.Request,
    res: Express.Response,
    next: Function
): void => {
    try{
        const secret: string | undefined = process.env.JWT_SECRET;
                
        if(secret){
            const token = JWT.verify(Token.getToken(req), secret, {
                audience: process.env.JWT_AUDIENCE,
                issuer: process.env.JWT_ISSUER,
                ignoreExpiration: false
            });

            req.body.token = token;
            next();
        } else {
            throw "JWT_SECRET must be defined";
        }
    } catch(e) {
        res.status(401).json(ResponseFactory.error("Unauthorized"));
    }
};
