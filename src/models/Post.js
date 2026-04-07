const {DataTypes} = require('sequelize');
const sequelize = require('../config/database');

const Post = sequelize.define('Post', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },

    titulo: {
        type: DataTypes.STRING,
        allowNull: false
    },

    conteudo: {
        type: DataTypes.TEXT,
        allowNull: false
    },

    autorId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Users',
            key: 'id'
        }
    },

    curtidas: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    }

}, {
    timestamps: true,
});

module.exports = Post;