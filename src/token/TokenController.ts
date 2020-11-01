import Express from "express";
import JWT from "jsonwebtoken";
import { Controller, Get } from "@overnightjs/core";
import { ResponseFactory } from "@src/shared/ResponseFactory";
import { Token } from "@src/token/model/Token";

@Controller("token")
export class TokenController {
    @Get("validate")
    validateToken(req: Express.Request, res: Express.Response, next: Function): void {
        try {
            const secret: string | undefined = process.env.JWT_SECRET;

            if (secret) {
                JWT.verify(Token.getToken(req), secret, {
                    audience: process.env.JWT_AUDIENCE,
                    issuer: process.env.JWT_ISSUER,
                    ignoreExpiration: false
                });
                res.json(ResponseFactory.success({ valid: true }));
            } else {
                throw "JWT_SECRET must be defined";
            }
        } catch (e) {
            res.json(ResponseFactory.success({ valid: false }));
        }
    }
}