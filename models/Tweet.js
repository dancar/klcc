// createTODO: write?
'use strict';
module.exports = (sequelize, DataTypes) => {
  var tweet = sequelize.define('Tweet', {
    text: DataTypes.STRING,
    id: {
      type: DataTypes.STRING(20),
      primaryKey: true,
      unique: true
    },
    metadata: DataTypes.JSON
  }, {});
  tweet.associate = function(models) {
    // associations can be defined here
  };
  return tweet;
};
