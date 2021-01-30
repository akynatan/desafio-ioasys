# desafio-ioasys

## Bibliotecas e tecnologias Utilizadas
bycript: criptografia de senhas
dotenv: utilizacao do .env
express: controle de rotas
overnightjs: implementação de decoradores typescript para metodos destinados a chamar as rotas express
jsonwebtoken: autenticação
sequelize: orm
typescript: linguagem desenvolvida

## Banco de Dados
postgres: foi utilizado o orm sequelize para manipulaçao do banco de dados.

Funcionalidades da API
- Autenticação via JWT
- Criptografia de senhas com bycript
- Cadastro de usuários
- Cadastro de filmes (funcionalidade somente para usuários administradores)
- Votação em filmes (A contagem dos votos será feita por usuário de 0-4 que indica quanto o usuário gostou do filme)
- Listagem dos filmes (com possibilidade de filtro por diretor, nome, gênero e/ou atores)
- Detalhamento do filme trazendo todas as informações sobre o filme, inclusive a média dos votos


