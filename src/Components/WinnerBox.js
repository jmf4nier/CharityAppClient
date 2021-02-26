import React from 'react'
import {Grid, makeStyles} from '@material-ui/core'

export default function WinnerBox(props) {
  const { winner } = props
  return (
    <div >
      {winner !== 'System Ready' ? (
        <div>
          <h1>
            <span>{winner} Rang in First!</span>
          </h1>
        </div>
      ) : (
        <div>
          <h3>{winner}</h3>
        </div>
      )}
    </div>
  )
}
