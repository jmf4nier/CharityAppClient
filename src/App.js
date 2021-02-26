import './App.css'
import { makeStyles, Container, Grid } from '@material-ui/core'
import PlayerBox from './Components/PlayerBox'
import { useState, useEffect } from 'react'
import { io } from 'socket.io-client'
import Textfield from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import WinnerBox from './Components/WinnerBox'

const socket = io('https://ring-in.herokuapp.com/', {
  transports: ['websocket', 'polling'],
})
const useStyles = makeStyles({
  root: {},
  middle: {
    marginTop: '5vh',
    marginBottom: '5vh'
  },
  ringerButton: {
    backgroundColor: 'red',
    marginTop: '2vh',
    borderRadius: '50%',
    height: '20vh',
    width: '20vh',
  },
  heading: {
    fontSize: '2vh',
    marginBottom: '4vh',
  },
  spinningLights: {
    maxHeight: '3vh',
    maxWidth: '3vh',
    marginLeft: '1vh',
    marginRight: '1vh',
  },
})

function App() {
  const classes = useStyles()
  const [name, setName] = useState('')
  const [winner, setWinner] = useState('System Ready')
  const [players, setPlayers] = useState([])
  const [ready, setReady] = useState(false)

  useEffect(() => {
    socket.on('newGame', (players) => {
      setPlayers(players)
      setReady(false)
      setWinner('System Ready')
    })
    socket.on('ring', (winner) => {
      setWinner(winner)
    })
    socket.on('reset', () => {
      setWinner('System Ready')
    })
    socket.on('players', (names) => {
      setPlayers(names)
    })
  })

  const onTextChange = (e) => {
    setName(e.target.value)
  }
  const onNameSubmit = (e) => {
    e.preventDefault()
    if (name === '') {
      alert('please enter a name')
    }
    setReady(true)
    socket.emit('players', name)
  }

  const handleReset = () => {
    socket.emit('reset')
    setWinner('System Ready')
  }
  const handleBuzzer = (e) => {
    e.preventDefault()
    socket.emit('ring', name)
  }

  const newGame = () => {
    socket.emit('newGame', 'reset request')
    setWinner('System Ready')
    setName('')
    return null
  }

  return (
    <div className="App">
      <div className={classes.heading}>
        <h1 className={classes.title}>
          <span className={classes.spinningLights}>
            <img
              src="https://www.animatedimages.org/data/media/930/animated-police-light-image-0004.gif"
              alt="stuff"
            />
          </span>
          Hit That Buzzer
          <span className={classes.spinningLights}>
            <img
              src="https://www.animatedimages.org/data/media/930/animated-police-light-image-0004.gif"
              alt="stuff"
            />
          </span>
        </h1>
      </div>
      <div>
        <form onSubmit={(e) => onNameSubmit(e)}>
          <Grid container spacing={1}>
            <Grid item xs={6}>
              <Textfield
                name="name"
                onChange={(e) => onTextChange(e)}
                value={name}
                label="enter your name"
                variant="outlined"
              />
            </Grid>

            <Grid item xs={6}>
              <Button
                type="submit"
                style={{ marginTop: '2vh' }}
                variant="contained"
                color="primary"
              >
                Submit
              </Button>
            </Grid>
          </Grid>
        </form>
      </div>
      <Grid container spacing={10} className={classes.middle}>
        <Grid item xs={6}>
          {ready ? (
            <div>
              <Button
                className={classes.ringerButton}
                size="large"
                variant="contained"
                color="secondary"
                onClick={handleBuzzer}
              >
                Ring In!
              </Button>
            </div>
          ) : (
            <div>
              <Button
                className={classes.ringerButton}
                disabled
                size="large"
                variant="contained"
                onClick={handleBuzzer}
              >
                Ring In!
              </Button>
            </div>
          )}
        </Grid>

        <Grid item xs={6}>
          <PlayerBox players={players} />
        </Grid>
      </Grid>
      <div>
        <WinnerBox winner={winner} />
      </div>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <Button
            size="large"
            variant="contained"
            style={{ backgroundColor: 'green' }}
            onClick={newGame}
          >
            Start A New Game
          </Button>
        </Grid>

        <Grid item xs={6}>
          <Button variant="contained" color="default" onClick={handleReset}>
            Reset
          </Button>
        </Grid>
      </Grid>
    </div>
  )
}

export default App
