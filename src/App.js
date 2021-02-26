import './App.css'
import { useState, useEffect } from 'react'
import { io } from 'socket.io-client'
import Textfield from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'

const socket = io('http://localhost:4000', {
  transports: ['websocket', 'polling'],
})

function App() {
  const [name, setName] = useState('')
  const [winner, setWinner] = useState('System Ready')
  const [players, setPlayers] = useState([])

  useEffect(() => {
    socket.on('newGame', (players) =>{
      setPlayers(players)
    })
    socket.on('ring', (winner) => {
      setWinner(winner)
    })
    socket.on('reset', () => {
      setWinner('System Ready')
    })
    socket.on('players', (names) => {
      setPlayers([...players, names])
    })
  })
  const handleReset = () => {
    socket.emit('reset')
    setWinner('System Ready')
  }
  const handleBuzzer = (e) => {
    e.preventDefault()
    if (name === '') {
      warning()
    } else {
      socket.emit('ring', name)
      setName(name)
    }
  }

  const warning = () => {
    alert('you must enter a name')
  }
  const newGame = ()=>{
    socket.emit('newGame')
    
  }

  const onTextChange = (e) => {
    setName(e.target.value)
  }
  const onNameSubmit = (e) => {
    e.preventDefault()
    if (name === '') {
      warning()
    }
    
    socket.emit('players', name)
    setPlayers([...players, name])
    setName('')
  }

  const renderPlayers = () => {
    players.map(player =>{
      return(
        <div>
          <h4>{player}</h4>
        </div>
      )
    })
  }

  const renderWinner = () => {
    if (winner !== 'System Ready') {
      return (
        <div>
          <h1>
            <span>{winner} Rang in First!</span>
          </h1>
        </div>
      )
    } else {
      return (
        <div>
          <h3>{winner}</h3>
        </div>
      )
    }
  }

  return (
    <div className="App">
      <form
        style={{ marginBottom: '2vh' }}
        onSubmit={(e) => onNameSubmit(e)}
      >
        <h1>Messenger</h1>
        <div>
          <Textfield
            name="name"
            onChange={(e) => onTextChange(e)}
            value={name}
            label="enter your name"
            variant="outlined"
          />
        </div>

        <div>
          <Button
            type="submit"
            style={{ marginTop: '2vh' }}
            variant="contained"
            color="primary"
          >
            Submit
          </Button>
        </div>
      </form>
      <div style={{ marginTop: '2vh' }}>
        <Button variant="contained" color="default" onClick={handleReset}>
          Reset
        </Button>
      </div>
      <div style={{ marginTop: '2vh' }}>
        <Button
          size="large"
          variant="contained"
          color="secondary"
          onClick={handleBuzzer}
        >
          Ring In!
        </Button>
      </div>
      
      <div style={{ marginTop: '2vh' }}>
        {renderWinner()}
        {renderPlayers()}
      </div>

      <div style={{ marginTop: '10vh' }}>
        <Button
          size="large"
          variant="contained"
          style={{backgroundColor:'green'}}
          onClick={newGame()}
        >
          Start A New Game
        </Button>
      </div>
    </div>
  )
}

export default App
