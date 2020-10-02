import React from "react";
import spinner from '../assets/spinner.svg';
import styled from "styled-components";

const SpinnerStyles = styled.div`
  display: flex;
  flex-flow: row wrap;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  flex-wrap: wrap;
  img {
    display: block;
    flex: 0 1 150px;
  }
  
  .bounce {
    animation-duration: 2s;
    animation-iteration-count: infinite;
    animation-name: bounce;
    animation-timing-function: cubic-bezier(0.280, 0.840, 0.420, 1);
    transform-origin: bottom;
  }
  @keyframes bounce {
    0%   { transform: scale(1,1) translateY(0); }
    10%  { transform: scale(1.1,.9) translateY(0); }
    30%  { transform: scale(.9,1.1) translateY(-20px); }
    50%  { transform: scale(1.05,.95) translateY(0); }
    57%  { transform: scale(1,1) translateY(-7px); }
    64%  { transform: scale(1,1) translateY(0); }
    100% { transform: scale(1,1) translateY(0); }
  }
`

export default function Spinner({className}) {
  return (
    <SpinnerStyles className={`spinner ${className || ''}`}>
      <img src={spinner} alt="Spinner" className="bounce"/>
    </SpinnerStyles>
  )
}
