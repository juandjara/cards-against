export default class Game {
  name = null
  deck = null
  zarPlayer = null
  round = {
    phase: null,
    blackCard: null,
    whiteCards: []
  }
  handCardLimit = 7
  hands = {
    userid1: [],
    userid2: []
  }

  get remainingWhiteCards () {}
  get remainingBlackCards () {}

  get previousWhiteCards () {}
  get previousBlackCards () {}

  get roundType () {}

  startRound () {
    this.zarPlayer = this.getNextZar()
    this.round.blackCard = this.getNextBlackCard()
    this.fillHands()
  }

  getNextBlackCard () {
    return null // TODO
  }

  getNextZar () {
    return null // TODO
  }

  getHand (userId) {
    return this.hands[userId]
  }

  fillHands () {
    for (const id in this.hands) {
      this.hands[id] = this.remainingWhiteCards.slice(0, this.handCardLimit)
    }
  }

  addWhiteCard (userid, card) {
    this.hands[userid].splice(
      this.hands[userid].indexOf(card),
      1
    )
    this.round.whiteCards.push(card)
  }

  givePoints () {}

  finishRound () {
    for (const card of this.round.whiteCards) {
      card.hidden = false
    }
    this.givePoints()
    this.startRound()
  }

}