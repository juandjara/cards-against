logica del cartas contra la humanidad
---

- cartas:
conjunto de cartas blancas
conjunto de cartas negras

- jugadores:
1 zar
de 2 a 9 subditos

- rondas:
cartas por ronda
carta blanca ganadora
carta negra de la ronda

- puntos
cartas negras resueltas como puntos

- modos de juegos (rotacion del puesto de zar)
el ganador es el siguiente zar
el puesto de zar va rotando clockwise

- mas normas:
los jugadores tienen ¿7? cartas al inicio
cada ronda, despues de usar sus cartas en esa ronda, reponen cartas hasta tener 7 de nuevo
para las rondas de "pick 2", se lee primero la carta que se elige primero


--- traduccion a arquitectura de software


1. domain
2. app
3. infra
4. ui

- domain -

Card
  type
  text

GameCard
  card
  player
  hidden

Game
  zar player
  current black card (Card)
  sent white cards (GameCards)
  round type
  round phase

round types
  single (pick 1)
  multiple (pick 2)

round phases
  0. no zar, no black card
  1. round has a zar
  2. round has a black card
  3. every player has enough white cards
  4. players send their white cards
  5. white card votation
  6. finished


- use cases - 

create a game
  - pick a deck (set of white cards + set of black cards)
  - give a name to the game

start a game
  - shuffle the decks
  - start the first round

start a round
  - pick the next zar based on game-mode (first zar is the creator of the room)
  - reveal the selected black card
  - fill the white cards of the players

middle of the round
  - every player but the zar sends a white card

send your white card
  - add it to the center of the game
  - remove it from your hand

finish a round
  1. the zar closes the list of white cards for this round
  2. reveal the white cards one by one
  3. zar picks the winner
  4. winner adds the black cards to his set of card-wins
  5. next round start

