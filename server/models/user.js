module.exports = (sequelize, DataTypes) => {
    return sequelize.define('user', {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4,
            unique: true,
        },
        nickName: { type: DataTypes.STRING },
        avatarUrl: { type: DataTypes.STRING },
        country: { type: DataTypes.STRING },
        province: { type: DataTypes.STRING },
        city: { type: DataTypes.STRING },
        gender: { type: DataTypes.INTEGER },
        language: { type: DataTypes.STRING },

        phone: { type: DataTypes.STRING, defaultValue: '' },
        openId: { type: DataTypes.STRING },
        unionId: { type: DataTypes.STRING, defaultValue: '' },
    })
}
