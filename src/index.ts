import "reflect-metadata";

import Compress from "compression";
import BodyParser from "body-parser";
import Morgan from "morgan";
import Dotenv from "dotenv";

import { Server } from "@overnightjs/core";
import { container } from "tsyringe";
import { ErrorMiddleware } from "@src/error/ErrorMiddleware";
import { UserController } from "@src/user/UserController";
import { FilmeController } from "@src/filme/FilmeController";
import { AuthController } from "@src/auth/AuthController";
import { TokenController } from "@src/token/TokenController";

require("./database");

class ServerApp extends Server {
    constructor() {
        super();

        this.setupConfigurations();
        this.setupControllers();
    }

    // Configure your services middlewares
    private setupConfigurations(): void {
        this.app.use(Morgan("combined"));
        this.app.use(BodyParser.json());
        this.app.use(BodyParser.urlencoded({ extended: true }));
        this.app.use(Compress());
    }

    // Setup your controller using overnightjs
    private setupControllers(): void {
        super.addControllers([
            container.resolve(AuthController),
            container.resolve(UserController),
            container.resolve(FilmeController),
            container.resolve(TokenController)
        ]);

        this.app.use(ErrorMiddleware);
    }

    public start(port: number): void {
        this.app.listen(port, (): void => {
            console.log("Server listening on port " + port + "!");
        });
    }
}

try {
    Dotenv.config();

    const server: ServerApp = new ServerApp();
    server.start(Number(process.env.PORT) || 3000);
} catch (e) {
    console.log(e);
}
