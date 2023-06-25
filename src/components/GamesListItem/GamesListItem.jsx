function GamesListItem({ game, i }) {
  console.log(game);
  
  return (
  <tr key={i}>
    <td>{game}</td>
  </tr>)
}

export default GamesListItem;
