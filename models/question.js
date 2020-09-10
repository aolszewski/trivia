module.exports = function(sequelize, DataTypes) {
  const Question = sequelize.define("Question", {
    questionText: {
      type: DataTypes.STRING,
      allowNull: false
    }
  });
  Question.associate = function(models) {
    Question.hasMany(models.Answer, {});
  };
  return Question;
};
