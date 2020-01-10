import React from 'react'
import styled from 'styled-components'

const RadioStyles = styled.div`
position: relative;

input {
	-moz-appearance: none;
	-webkit-appearance: none;
	appearance: none; /* in case this ever gets supported */
	background: none;
	opacity: .00001;
	z-index: 2;
	font: inherit;
	margin: 0;
}

label {
	display: inline-block;
	padding: .75em .5em .75em 2em;
}

input,
label:before,
label:after {
	border: 1px solid currentColor;
	height: 1.125em;
	left: .125em;
	position: absolute;
	top: .825em;
	width: 1.125em;
}

input,
label:before,
label:after {
	border-radius: 100%;
	content: " ";
	transition:
    border-color .2s ease-in-out,
    box-shadow .2s ease-in-out;
}

label:after {
	border-color: #565656;
}

label:before {
	border-color: transparent;
	box-shadow: 0 0 0 0px rgba(0,0,0,0);
}

input:checked ~ label:before {
	border-color: transparent;
	box-shadow: 0 0 0 2px #0d5192;
}

input:focus ~ label:before {
	border-color: transparent;
	box-shadow: 0 0 0 3px #228BEC;
}

input:checked ~ label:after {
	border-color: #fff;
	border-width: 4px;
	box-shadow: inset 0 0 0 5px #0d5192;
}

input[disabled] ~ label {
	opacity: .5;
}

@media screen and (-ms-high-contrast: active) {
	input:checked ~ label:before {
		background: window;
		border: 6px solid buttonface;
		box-shadow: none;
	}
}
`

export default function RadioButton ({ label, ...props }) {
  return (
    <RadioStyles className="radio-option">
      <input type="radio" className="radio-input" {...props} />
      <label htmlFor={props.id || props.name}>{label}</label>
    </RadioStyles>
  )
}
