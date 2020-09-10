module.exports = function(sequelize, DataTypes) {
  const Category = sequelize.define("Category", {
    categoryName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1, 30]
      }
    },
    apiCategoryId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isInt: true
      }
    }
  });

  Category.associate = function(models) {
    Category.hasMany(models.Score, {});
  };

  return Category;
};
