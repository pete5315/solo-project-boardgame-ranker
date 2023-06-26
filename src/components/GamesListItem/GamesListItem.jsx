function GamesListItem({ game, i }) {
  // console.log(game);
  
  return (
  <tr key={i}>
    <td key={i}>{game}</td>
  </tr>)
}

export default GamesListItem;
