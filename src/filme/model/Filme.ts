import { Model } from 'sequelize-typescript';
import { DataTypes } from 'sequelize';

class Filme extends Model {
    static init(sequelize: any) {
        super.init({
            name: DataTypes.STRING,
            ano_lancamento: DataTypes.INTEGER,
            genero: DataTypes.STRING,
            diretor: DataTypes.STRING,
            atores: DataTypes.ARRAY(DataTypes.STRING),
            classificacao: DataTypes.INTEGER,
        }, {
            sequelize
        })
    }

    static associate(models: any) {
        this.hasMany(models.Votos, { foreignKey: 'filme_id'});
    }
}

module.exports = Filme;