const {DataTypes} = require('sequelize');
const sequelize = require('../config/database');

const Servico = sequelize.define('Servico', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },

    nome: {
        type: DataTypes.STRING,
        allowNull: false
    },

    descricao: {
        type: DataTypes.STRING,
        allowNull: false,
    },

    preco: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },

    categoria: {
        type: DataTypes.STRING,
        allowNull: false,
    },

    duracao: {
        type: DataTypes.INTEGER,
        defaultValue: 60,
    },

    prestadorId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Users',
            key: 'id'
        }
    },

    ativo: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    }
}, {
    timestamps: true,
});

 module.exports = Servico;

