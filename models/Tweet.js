// createTODO: write?
'use strict';
module.exports = (sequelize, DataTypes) => {
  var tweet = sequelize.define('Tweet', {
    text: DataTypes.STRING,
    tweet_id_str: {
      type: DataTypes.STRING,
      unique: true
    }
  }, {});
  tweet.associate = function(models) {
    // associations can be defined here
  };
  return tweet;
};
