import Express from "express";
import { Controller, Post, Get, ClassMiddleware } from "@overnightjs/core";
import { injectable } from "tsyringe";
import { ResponseFactory } from "@src/shared/ResponseFactory";
import { AuthMiddleware } from "@src/shared/AuthMiddleware";
const Filme = require("./model/Filme");
const Votos = require("../votos/model/Votos");
const User = require("../user/model/User");

@injectable()
@ClassMiddleware(AuthMiddleware)
@Controller("filme")
export class FilmeController {
    constructor() { }

    @Post("/")
    async registerFilme(req: Express.Request, res: Express.Response, next: Function): Promise<void>{
        const { token, filmeName, filmeAnoLancamento, filmeGenero, filmeDiretor, filmeAtores, filmeClassificacaoIndicativa } = req.body;

        if(!token.user.is_admin) {
            res.status(401).json(ResponseFactory.success("Você não tem permissão para cadastrar filmes."));
            return;
        }

        const filmeCreate = await Filme.create({
            name: String(filmeName),
            ano_lancamento: Number(filmeAnoLancamento),
            genero: String(filmeGenero),
            diretor: String(filmeDiretor),
            atores: filmeAtores,
            classificacao: Number(filmeClassificacaoIndicativa)
        });

        if (filmeCreate) {
            res.status(200).json(ResponseFactory.success("Filme cadastrado com sucesso."));
            return;
        }
        
        res.status(500).json(ResponseFactory.error("Falha ao cadastrar usuário."));
        return;
    }

    @Get("/")
    async listAllFilmes(req: Express.Request, res: Express.Response, next: Function): Promise<void> {
        const nome = req.query.nome;
        const diretor = req.query.diretor;
        const genero = req.query.genero;

        var where = {}
        if (nome) {
            where = {...where, 'name': nome}
        }
        if (diretor) {
            where = {...where, 'diretor': diretor}
        }
        if (genero) {
            where = {...where, 'genero': genero}
        }

        const filmes = await Filme.findAll({
            where: where,
            include: [
                {
                    model: Votos,
                    attributes: ['voto']
                }
            ]
        });

        if (filmes) {
            const filmesAt = filmes.map((filme: any) => {
                const sumVotos = filme.Votos.reduce((acc: number, voto: number) => {
                    return acc += voto.voto;
                }, 0);

                return {
                    "id": filme.id,
                    "name": filme.name,
                    "anoLancamento": filme.ano_lancamento,
                    "genero": filme.genero,
                    "diretor": filme.diretor,
                    "atores": filme.atores,
                    "classificacao": filme.classificacao,
                    "mediaAvaliacao": filme.Votos.length ? sumVotos / filme.Votos.length : 0
                }
            });
            res.status(200).json(ResponseFactory.success(filmesAt));
        } else {
            res.status(400).json(ResponseFactory.success("Escolha outro filtro."));
        }
    }

    @Get(":id")
    async detalhaFilme(req: Express.Request, res: Express.Response, next: Function): void {
        const filmeID = req.params.id;

        const filmes = await Filme.findOne({
            where: {
                id: filmeID
            },
            include: [
                {
                    model: Votos,
                    attributes: ['voto']
                }
            ]
        });
        const sumVotos = filmes.Votos.reduce((acc, voto) => {
            return acc += voto.voto;
        }, 0);

        const filmeAt = {
            "id": filmes.id,
            "name": filmes.name,
            "anoLancamento": filmes.ano_lancamento,
            "genero": filmes.genero,
            "diretor": filmes.diretor,
            "atores": filmes.atores,
            "classificacao": filmes.classificacao,
            "mediaAvaliacao": filmes.Votos.length ? sumVotos / filmes.Votos.length : 0
        }

        res.status(200).json(ResponseFactory.success(filmeAt));
    }

    @Post("votar")
    async votarFilme(req: Express.Request, res: Express.Response, next: Function): void {
        const { filmeID, userID, voto } = req.body;

        const user = await User.findByPk(userID);
        if (!user) {
            res.status(400).json(ResponseFactory.error("User Invalid."));
            return;
        }
     
        const film = await Filme.findByPk(filmeID);
        if (!film) {
            res.status(400).json(ResponseFactory.error("Film Invalid."));
            return;
        }

        Votos.destroy({
            where: {
                filme_id: filmeID,
                user_id: userID
            }
        });

        const votoCreate = await Votos.create({
            filme_id: Number(filmeID),
            user_id: Number(userID),
            voto: Number(voto)
        });

        if (votoCreate) {
            res.status(200).json(ResponseFactory.success("Voto cadastrado com sucesso."));
            return;
        }
        
        res.status(500).json(ResponseFactory.error("Falha ao cadastrar voto."));
        return;
    }
}