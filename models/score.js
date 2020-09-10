/* eslint-disable no-unused-vars */
/* eslint-disable camelcase */
/* eslint-disable prettier/prettier */
/* eslint-disable indent */

module.exports = function(sequelize, DataTypes) 
{
	const Score = sequelize.define("Score",
	{
		score:
		{
			type: DataTypes.INTEGER,
			allowNull: false,
			isInt: true
		}			  
	});
	
	Score.associate = function(models)
	{
		Score.belongsTo(models.Category, 
		{
			foreignKey: 
			{
				allowNull: false				
			}
		}),

		Score.belongsTo(models.User,
		{
			foreignKey: {allowNull:false}
		});
	};

  return Score;
};
