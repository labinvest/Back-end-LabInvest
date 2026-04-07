const {DataTypes} = require('sequelize');
const sequelize = require('../config/database');

const Mensagem = sequelize.define('Mensagem', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },

    remetenteId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Users',
            key: 'id'
        }
    },

    destinatarioId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Users',
            key: 'id'
        }
    },

    conteudo: {
        type: DataTypes.TEXT,
        allowNull: false
    },

    lida: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },

    dataLeitura: {
        type: DataTypes.DATE,
        allowNull: true
    },

    dataEnvio: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
}, {
    timestamps: true,
});

module.exports = Mensagem;

