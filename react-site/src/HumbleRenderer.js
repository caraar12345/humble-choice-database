// let gameCards = gameTitle.map((title, index) => {
//   return (
//     <div className="card-container" key={index}>
//       <Card className="card">
//         <Card.Img variant="top" src={gameImage[index]} />
//         <Card.Body>
//           <Card.Title>{title}</Card.Title>
//             {gameDescription[index]})
//         </Card.Body>
//       </Card>
//     </div>
//   )
// });

import React from "react";

export default class HumbleRenderer extends React.Component {
  render({dataArray}) {
    return (
      <div className="container">
      </div>
    );
  }
}