import { Sequelize, DataTypes } from "sequelize";
const dbConfig = require("../config/database");

const User = require("../user/model/User");
const Filme = require("../filme/model/Filme");
const Votos = require("../votos/model/Votos");

const sequelize = new Sequelize(dbConfig);

User.init(sequelize);
Filme.init(sequelize);
Votos.init(sequelize);

User.associate(sequelize.models);
Filme.associate(sequelize.models);
Votos.associate(sequelize.models);

module.exports = { sequelize };