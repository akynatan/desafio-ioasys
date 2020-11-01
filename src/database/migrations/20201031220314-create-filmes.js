'use strict';

module.exports = {
    up: async(queryInterface, Sequelize) => {
        await queryInterface.createTable('filmes', {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false,
            },
            name: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            ano_lancamento: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            genero: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            diretor: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            atores: {
                type: Sequelize.ARRAY(Sequelize.STRING),
                allowNull: false,
            },
            classificacao: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            created_at: {
                type: Sequelize.DATE,
                allowNull: false,
            },
            updated_at: {
                type: Sequelize.DATE,
                allowNull: false,
            }
        });
    },

    down: async(queryInterface, Sequelize) => {
        await queryInterface.dropTable('filmes');
    }
};