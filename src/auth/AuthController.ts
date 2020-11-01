import Express from "express";
import JWT from "jsonwebtoken";
import Bcrypt from "bcryptjs";
import { Controller, Post } from "@overnightjs/core";
import { injectable } from "tsyringe";
import { ResponseFactory } from "@src/shared/ResponseFactory";
const User = require("../user/model/User");

@injectable()
@Controller("auth")
export class AuthController {
    constructor() { }

    @Post("/")
    async login(req: Express.Request, res: Express.Response): Promise<void> {
        const { login, password } = req.body;
        if (!login || !password) {
            res.status(400).json(ResponseFactory.error("Username and Password are required"));
            return;
        }

        const user = await User.findOne({
            where: {
                login: login
            }
        });
        if (!user) {
            res.status(401).json(ResponseFactory.error("Not exists user with login"));
            return;
        }
        const passwordMatch = Bcrypt.compareSync(password, user.pass);

        if (!passwordMatch) {
            res.status(401).json(ResponseFactory.error("Invalid credentials"));
        }

        const secret: string | undefined = process.env.JWT_SECRET;
        if (secret) {
            const jwt = JWT.sign(
                { user: user },
                secret,
                {
                    audience: process.env.JWT_AUDIENCE,
                    issuer: process.env.JWT_ISSUER,
                    expiresIn: "1 day"
                });

            res.status(200).json(ResponseFactory.success({
                token: jwt,
                user: {
                    "id": user.id,
                    "name": user.name,
                    "login": user.login,
                    "email": user.email,
                    "is_active": user.is_active,
                    "is_admin": user.is_admin
                }
            }));
            return;
        } else {
            res.status(500).json(ResponseFactory.error("Unexpected error"));
            return;
        }
    }
}