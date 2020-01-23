import styled from 'styled-components'

const CardActionsStyle = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  button {
    border: none;
    background-color: none;
    background-color: transparent;
    color: #333;
    cursor: pointer;
    padding: 4px;
    height: 32px;
    border-radius: 4px;
    & + button {
      margin-left: 4px;
    }
    &:hover, &:focus {
      background-color: #f5f5f5;
    }
    &[disabled] {
      pointer-events: none;
      opacity: 0.5;
    }
  }
`

export default CardActionsStyle
