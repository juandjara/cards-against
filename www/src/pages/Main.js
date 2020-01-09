import React, { Fragment } from 'react'
import Header from '../components/Header'

export default function Main ({ children }) {
  return (
    <Fragment>
      <Header></Header>
      <main>{children}</main>
    </Fragment>
  )
}
