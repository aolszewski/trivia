module.exports = function(sequelize, DataTypes) {
  const Answer = sequelize.define("Answer", {
    answerText: {
      type: DataTypes.STRING,
      allowNull: false
    },
    isCorrect: {
      type: DataTypes.BOOLEAN
    }
  });
  Answer.associate = function(models) {
    Answer.belongsTo(models.Question, {});
  };
  return Answer;
};
