"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Review extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Review.belongsTo(models.Product, {
        foreignKey: "productId",
        as: "product",
      });
    }
  }
  Review.init(
    {
      userId: DataTypes.STRING,
      productId: DataTypes.STRING,
      content: DataTypes.STRING,
      star: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Review",
    }
  );
  return Review;
};
