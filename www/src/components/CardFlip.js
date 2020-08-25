import styled from 'styled-components'

const CardFlip = styled.div`
  position: relative;
  transition: transform 1s;
  transform-style: preserve-3d;
  width: 180px;
  height: 180px;

  .card {
    margin: 0;
  }

  ${props => props.rotated ? `
    transform: rotateY(180deg);
  ` : ''}

  .card-flip-elem {
    position: absolute;
    backface-visibility: hidden;
  }

  .card-flip-back {
    transform: rotateY(180deg);
  }
`

export default CardFlip
