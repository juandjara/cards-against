import styled from 'styled-components'

const CardStyles = styled.li`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-shrink: 0;
  width: 180px;
  height: 180px;
  margin-top: 16px;
  margin-bottom: 8px; 
  padding: 12px 16px;
  padding-bottom: 24px;
  background-color: white;
  border: 2px solid #333;
  border-radius: 16px;
  box-shadow: 0px 0px 8px 0px rgba(0,0,0, 0.25);
  transition: transform 0.25s ease;
  font-weight: bold;
  z-index: 1;
  transform-style: preserve-3d;

  &.white {
    border-color: #333;
    background-color: white;
    color: #333;
  }

  &.black {
    border-color: white;
    background-color: #333;
    color: white;
  }

  &:hover {
    transform: translateY(-12px);
  }

  & + li {
    margin-left: -12px;
  }

  p {
    margin: 0;
  }
`

export default CardStyles
