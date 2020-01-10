import styled from 'styled-components'

/* Taken from http://elemental-ui.com/forms */
const Input = styled.input`
  -moz-appearance: none;
  -webkit-appearance: none;
  appearance: none;

  display: block;
  width: 100%;
  height: 2.4em;
  line-height: 1.2;
  font-size: inherit;
  padding: 0 0.75em;
  color: #333;
  box-shadow: inset 0 1px 2px rgba(0,0,0,.1), 0 -1px 1px #FFF, 0 1px 0 #FFF;
  border: 1px solid #ccc;
  border-top-color: #c2c2c2;
  border-bottom-color: #d6d6d6;
  border-radius: 0.25em;
  background-color: white;
  background-image: none;
  transition: 
    border-color ease-in-out 0.15s,
    box-shadow ease-in-out 0.15s;

  &::-moz-focus-inner {
    border: 0;
    padding: 0;
    outline: 0;
  }

  &::placeholder {
    color: #999;
  }

  &:hover, &:focus {
    outline: 0;
  }

  &:hover {
    border-color: #b3b3b3;
  }

  &:focus {
    border-color: #1385e5;;
    box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075), 0 0 0 3px rgba(19, 133, 229, 0.1);
  }
`
export default Input
