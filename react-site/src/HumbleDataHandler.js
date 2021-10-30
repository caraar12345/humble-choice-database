import React from 'react';
import "./App.css";
import humbleData from './data';
import jp from 'jsonpath';
import HumbleRenderer from './HumbleRenderer';

export default class HumbleDataHandler extends React.Component {
  render () {
    console.log(humbleData)
    var flattenedData = []
    var all_months = jp.paths(humbleData, '$.*')
    for (var i = 0; i < all_months.length; i++) {
      var month = all_months[i][1]
      var url = jp.query(humbleData, `$['${month}'].url`);
      var gameTitle = jp.query(humbleData, `$['${month}'].games[*].title`);
      var gameDescription = jp.query(humbleData, `$['${month}'].games[*].description`);
      var gameImage = jp.query(humbleData, `$['${month}'].games[*].image`);
      var gameUserRating = jp.query(humbleData, `$['${month}'].games[*].user_rating`);
      var gamePlatforms = jp.query(humbleData, `$['${month}'].games[*].platforms`);
      var gameMsrp = jp.query(humbleData, `$['${month}'].games[*].msrp`);
      var gameDevelopers = jp.query(humbleData, `$['${month}'].games[*].developers`);
      var gameGenres = jp.query(humbleData, `$['${month}'].games[*].genres`);
      var gameTypes = jp.query(humbleData, `$['${month}'].games[*].types`);
      var gameHumbleType = jp.query(humbleData, `$['${month}'].games[*].humble_type`);
      var extraTitle = jp.query(humbleData, `$['${month}'].extras[*].title`);
      var extraImage = jp.query(humbleData, `$['${month}'].extras[*].image`);
      var extraTypes = jp.query(humbleData, `$['${month}'].extras[*].types`);
      flattenedData.push([month, url, gameTitle, gameDescription, gameImage, gameUserRating, gamePlatforms, gameMsrp, gameDevelopers, gameGenres, gameTypes, gameHumbleType, extraTitle, extraImage, extraTypes])  
    }

    for (var l = 0; l < flattenedData.length; l++) {
      for (var j = 0; j < flattenedData[i][1].length; j++) {
        console.log(flattenedData[i][1][j])
      }
    }

    return(
      <HumbleRenderer dataArray={flattenedData} />
    )
  }
}