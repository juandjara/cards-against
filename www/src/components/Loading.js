import React from 'react'
import Spinner from "./Spinner";
import Localise from "./Localise";
import styled from "styled-components";

const LoadingStyles = styled.div`
  text-align: center;
    
  .icon {
    display: inline-block;
    width: 4rem;
    height: 4rem;
  }
  
  h2 {
    font-size: 24px;
    line-height: 32px;
    font-weight: 500;
    margin: 0;
  }
`


export default function Loading({className}) {
  return (
    <LoadingStyles className={`loading ${className || ''}`}>
      <Spinner className="icon"/>
      <h2><Localise node="general.loading"/></h2>
    </LoadingStyles>
  )
}
