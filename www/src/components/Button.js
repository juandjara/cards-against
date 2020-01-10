import styled from 'styled-components'

const Button = styled.button`
  font-size: 14px;
  font-weight: bold;
  background: transparent;
  border: 1px solid #bfbfbf;
  border-radius: 4px;
  padding: 8px 16px;
  cursor: pointer;
  background: linear-gradient(to bottom, #fafafa 0%, #eaeaea 100%);

  &:hover {
    background: linear-gradient(to bottom, #fff 0%, #eee 100%);
  }

  
  &::-moz-focus-inner {
    outline: 0;
    border: none;
  }

  &:focus {
    box-shadow: 0 0 0 3px rgba(19, 133, 229, 0.1);
    outline: 0;
  }

  &:active {
    background: #e6e6e6;
  }
`
export default Button
