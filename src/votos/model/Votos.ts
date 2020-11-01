import { Model } from 'sequelize-typescript';
import { DataTypes } from 'sequelize';

class Votos extends Model {
    static init(sequelize: any) {
        super.init({
            voto: DataTypes.INTEGER
        }, {
            sequelize
        })
    }

    static associate(models: any) {
        this.belongsTo(models.Filme, { foreignKey: 'filme_id'});
        this.belongsTo(models.User, { foreignKey: 'user_id'})
    }
}

module.exports = Votos;