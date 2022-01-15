'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('TransactionHistories', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      ProductId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model : 'Products',
          key : 'id'
        },
        onDelete : 'cascade',
        onUpdate: 'restrict'
      },
      UserId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references : {
         model: 'Users',
         key: 'id'
        },
        onDelete : 'cascade',
        onUpdate : 'restrict'
      },
      quantity: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      total_price: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('TransactionHistories');
  }
};