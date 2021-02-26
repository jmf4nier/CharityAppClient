import React from 'react'
import { makeStyles, Grid } from '@material-ui/core'

const useStyles = makeStyles({
  root: {
    alignContent:'centered',
    borderStyle: 'solid',
    height:'25vh',
    width: '25vh'
    
  },
  heading: {
    textDecoration: 'underline',
  },
  playerBoard: {
    
    listStylePosition:'inside',
    textAlign:'center'
  },
  listHolder:{
    alignContent:'centered',
   
  }
})

export default function PlayerBox(props) {
  
  const classes = useStyles()
  const { players } = props
  return (
    <div className={classes.root}>
      <h3 className={classes.heading}>Current Players</h3>
      <div className={classes.listHolder}>
        <ol className={classes.playerBoard}>
          {players.map((player, index) => {
            
            return <li key={index}>{player}</li>
          })}
        </ol>
      </div>
    </div>
  )
}
