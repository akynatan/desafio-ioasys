import { Model } from 'sequelize-typescript';
import { DataTypes } from 'sequelize';

class User extends Model {
    static init(sequelize: any) {
        super.init({
            name: DataTypes.STRING,
            login: DataTypes.STRING,
            pass: DataTypes.STRING,
            email: DataTypes.STRING,
            is_active: DataTypes.BOOLEAN,
            is_admin: DataTypes.BOOLEAN,
        }, {
            sequelize
        })
    }

    static associate(models: any) {
        this.hasMany(models.Votos, { foreignKey: 'user_id'});
    }
}

module.exports = User;