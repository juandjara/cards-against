import React, { useState, Fragment } from 'react'
import { Dialog } from '@reach/dialog'
import '@reach/dialog/styles.css'
import styled from 'styled-components'
import IconClose from './icons/IconClose'
import Button from './Button'
import CardStyles from './deck-edit/CardStyles'
import Carousel, { Dots } from '@brainhubeu/react-carousel';
import '@brainhubeu/react-carousel/lib/style.css';
import IconArrowLeft from './icons/IconArrowLeft'
import IconArrowRight from './icons/IconArrowRight'

const PlayerModalStyles = styled(Dialog)`
  position: relative;
  border-radius: 8px;
  min-width: max(51vw, 320px);

  h3 {
    margin: 0;
    font-weight: normal;
    font-size: 18px;
  }

  .card-pair {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;

    .card {
      margin: 8px;
    }
  }

  .close-btn {
    position: absolute;
    top: 4px;
    right: 4px;
    background: none;
    border: none;
    padding: 8px;
    height: 40px;
    cursor: pointer;
    border-radius: 8px;
    display: block;
    margin-left: auto;

    &:hover, &:focus {
      background-color: #f2f2f2;
    }
  }

  .actions {
    .btn {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      background: none;
      border: none;
      padding: 0;
      border-radius: 8px;
      height: 32px;
      color: var(--colorHigh);
      cursor: pointer;
      transition: background-color 0.5s;

      &:hover, &:focus {
        background-color: var(--colorVeryLow);
      }

      svg {
        fill: var(--colorHigh);
        circle {
          fill: var(--colorVeryLow);
        }
      }

      &.prev {
        left: -16px;
      }

      &.next {
        right: -16px;
      }
    }
  }

  .slider-dots {
    margin-top: 16px;

    li:first-child button {
      border-radius: 8px 0 0 8px;
    }

    li:last-child button {
      border-radius: 0 8px 8px 0;
    }
  }

  h2 {
    text-align: center;
    font-weight: 500;
    margin-top: 0;
  }
`

export default function PlayerModal ({ player, onClose }) {
  const [slide, setSlide] = useState(0)

  if (!player) {
    return null
  }

  const hasWins = player.wins.length > 0

  function prevSlide () {
    const prev = Math.max(0, slide - 1)
    setSlide(prev)
  }

  function nextSlide () {
    const next = Math.min(player.wins.length - 1, slide + 1)
    setSlide(next)
  }

  return (
    <PlayerModalStyles className="player-modal" aria-label="Dialogo de victorias" onDismiss={onClose}>
      <Button className="close-btn" onClick={onClose}>
        <IconClose />
      </Button>
      {hasWins ? (
        <Fragment>
          <h2>Victorias de {player.name}</h2>
          <Carousel value={slide} onChange={setSlide}>
            {player.wins.map(w => (
              <div className="card-pair" key={w.black.id}>
                <CardStyles className="card black">{w.black.text}</CardStyles>
                <CardStyles className="card white">{w.white.text}</CardStyles>
              </div>
            ))}
          </Carousel>
          <Dots className="slider-dots" value={slide} onChange={setSlide} number={player.wins.length} />
          <div className="actions">
            <button className="btn prev" onClick={prevSlide}>
              <IconArrowLeft width="32" height="32" />
            </button>
            <button className="btn next" onClick={nextSlide}>
              <IconArrowRight width="32" height="32" />
            </button>
          </div>
        </Fragment>
      ) : (
        <h3>Este jugador no ha ganado ning&uacute;n punto todav&iacute;a</h3>
      )}      
    </PlayerModalStyles>    
  )
}
