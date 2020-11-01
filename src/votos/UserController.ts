import Express from "express";
import { Controller, Post, Put, ClassMiddleware } from "@overnightjs/core";
import { injectable, inject } from "tsyringe";
import { ResponseFactory } from "@src/shared/ResponseFactory";
import { AuthMiddleware } from "@src/shared/AuthMiddleware";
const User = require("./model/User");

@injectable()
@ClassMiddleware(AuthMiddleware)
@Controller("user")
export class UserController {
    constructor() { }

    @Post("/")
    async registerUser(req: Express.Request, res: Express.Response, next: Function): Promise<void> {
        const { userName, userLogin, userPass, userEmail, userActive, userAdmin } = req.body;
        const users = await User.findAll({
            where: {
                login: userLogin
            }
        });
        if (users) {
            res.status(400).json(ResponseFactory.error("Escolha outro login."));
            return
        }

        const userCreate = await User.create({
            name: userName,
            login: userLogin,
            pass: userPass,
            email: userEmail,
            is_active: userActive,
            is_admin: userAdmin
        });
        if (userCreate) {
            res.status(200).json(ResponseFactory.success("Usuário cadastrado com sucesso."));
            return;
        }
        
        res.status(500).json(ResponseFactory.error("Falha ao cadastrar usuário."));
        return;
    }

    @Put(":id")
    async alterStatusUser(req: Express.Request, res: Express.Response): Promise<void> {
        const userID = req.params.id;

        if (userID === undefined && isNaN(Number(userID))) {
            res.status(400).json(ResponseFactory.error("Invalid user_id parameter"));
            return;
        }

        const user = await User.findOne({
            where: {
                id: userID
            }
        });
        if (!user) {
            res.status(422).json(ResponseFactory.error("Não existe usuário com esse ID."));
            return;
        }
        const userAtualizado = await User.update(
            {is_active: !user.is_active},
            {where: {
                    id: userID
                }
            }
        )
        if (userAtualizado) {
            res.status(200).json(ResponseFactory.success("Status do usuário atualizado com sucesso."));
            return;
        }

        res.status(500).json(ResponseFactory.error("Falha ao atualizar usuário."));
        return;
    }

    @Put(":id/update")
    async updateUsers(req: Express.Request, res: Express.Response): Promise<void> {
        const userID = req.params.id;
        const { newUserName, newUserLogin, newUserPass, newUserEmail, newUserActive, newUserAdmin } = req.body;

        const user = await User.findOne({
            where: {
                id: userID
            }
        });

        if (user) {
            const existsLogin = await User.findOne({
                where: {
                    login: newUserLogin
                }
            });
            if (existsLogin) {
                res.status(400).json(ResponseFactory.error("Escolha outro login."));
                return
            }
            
            const userAtualizado = await User.update(
                {
                    name: newUserName,
                    login: newUserLogin,
                    pass: newUserPass,
                    email: newUserEmail,
                    is_active: newUserActive,
                    is_admin: newUserAdmin
                },
                {where: {
                        id: userID
                    }
                }
            );

            if (userAtualizado) {
                res.status(200).json(ResponseFactory.success("Usuário Atualizado com sucesso."));
                return;
            }

        }
        res.status(500).json(ResponseFactory.error("Falha ao atualizar usuário."));
        return;
    }    
}