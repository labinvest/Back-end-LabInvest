const {DataTypes} = require('sequelize');
const sequelize = require('../config/database');

const Agendamento = sequelize.define('Agendamento', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },

    dataHora: {
        type: DataTypes.DATE,
        allowNull: false
    },

    clienteId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Users',
            key: 'id'
        }
    },
    servicoId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Servicos',
            key: 'id'
        }
    },

    prestadorId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Users',
            key: 'id'
        }
    },

    status: {
        type: DataTypes.ENUM('agendado', 'concluido', 'cancelado'),
        defaultValue: 'agendado'
    },

    observacoes: {
        type: DataTypes.TEXT,
    }
}, {
    timestamps: true,
});

module.exports = Agendamento;