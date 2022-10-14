import http from "http"
import { Server } from "socket.io"
import { Action, createEmptyGame, doAction, filterCardsForPlayerPerspective, playersWithTwoCards, Card  } from "./model"

const server = http.createServer() // how to create socket.io server
const io = new Server(server)
const port = 8091

export interface Config{  
  numOfDeck: number
  rankLimit: number 
}

let config:Config = { //default config
  numOfDeck:1,
  rankLimit:Infinity // 1 to K
}

let gameState = createEmptyGame(["player1", "player2"], config.numOfDeck, config.rankLimit) // change to config


function emitUpdatedCardsForPlayers(cards: Card[], newGame = false) {
  gameState.playerNames.forEach((_, i) => {
    let updatedCardsFromPlayerPerspective = filterCardsForPlayerPerspective(cards, i)
    if (newGame) {
      updatedCardsFromPlayerPerspective = updatedCardsFromPlayerPerspective.filter(card => card.locationType !== "unused")
    }
    console.log("emitting update for player", i, ":", updatedCardsFromPlayerPerspective)
    io.to(String(i)).emit(
      newGame ? "all-cards" : "updated-cards", 
      updatedCardsFromPlayerPerspective,
    )
  })
}

io.on('connection', client => { // connection (new browser want to join)
  function emitGameState() {
    client.emit(
      "game-state", 
      gameState.currentTurnPlayerIndex,
      gameState.phase,
      gameState.playCount,
      playersWithTwoCards(gameState),  // array parameter to store 
    )
  }
  
  console.log("New client")
  let playerIndex: number | null | "all" = null
  client.on('player-index', n => { //player-index is an event 
    playerIndex = n
    console.log("playerIndex set", n)
    client.join(String(n))
    if (typeof playerIndex === "number") {
      client.emit(
        "all-cards", 
        filterCardsForPlayerPerspective(Object.values(gameState.cardsById), playerIndex).filter(card => card.locationType !== "unused"),
      )
    } else {
      client.emit(
        "all-cards", 
        Object.values(gameState.cardsById),    
      )
    }
    emitGameState()
  })

  client.on("action", (action: Action) => {
    if (typeof playerIndex === "number") {
      const updatedCards = doAction(gameState, { ...action, playerIndex })
      emitUpdatedCardsForPlayers(updatedCards)
    } else {
      // no actions allowed from "all"
    }
    io.to("all").emit(
      "updated-cards", 
      Object.values(gameState.cardsById),    
    )
    io.emit(
      "game-state", 
      gameState.currentTurnPlayerIndex,
      gameState.phase,
      gameState.playCount,
      playersWithTwoCards(gameState) // array parameter to store 
    )
  })

  client.on("new-game", () => {
    gameState = createEmptyGame(gameState.playerNames, config.numOfDeck, config.rankLimit)
    const updatedCards = Object.values(gameState.cardsById)
    emitUpdatedCardsForPlayers(updatedCards, true)
    io.to("all").emit(
      "all-cards", 
      updatedCards,
    )
    emitGameState()
  })

  // for config
  client.on('get-config',() => { 
    io.emit(
      'get-config-reply',
      config)
  })


  client.on("update-config",(inputConfig:Config) => {
    let decks = inputConfig?.numOfDeck
    let rankLimit = inputConfig?.rankLimit
    let input = Object.keys(inputConfig)

    if (typeof decks !== 'number' || typeof rankLimit !== 'number' || input.length !== 2){
      client.emit('update-config-reply',false)
    }
    else{
      config.numOfDeck = decks
      config.rankLimit = rankLimit
      setTimeout(() => io.emit('update-config-reply', true), 2000) // 2 seconds
    }

})

})
server.listen(port)
console.log(`Game server listening on port ${port}`)
