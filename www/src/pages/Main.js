import React, { Fragment, useEffect } from 'react'
import Header from '../components/Header'
import Alerts from '../components/Alerts'

export default function Main ({ children }) {  
  return (
    <Fragment>
      <Alerts />
      <Header />
      <main className="main-content">{children}</main>
    </Fragment>
  )
}
