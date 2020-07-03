import React, { Fragment } from 'react'
import Header from '../components/Header'

export default function Main ({ children }) {
  return (
    <Fragment>
      <Header></Header>
      <main style={{ padding: '0 12px', margin: '0 auto', maxWidth: 1200 }}>{children}</main>
    </Fragment>
  )
}
