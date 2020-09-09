import React, { useEffect, useRef } from 'react'
import Alert from '@reach/alert'
import styled from 'styled-components'
import useGlobalSlice from '../services/useGlobalSlice'
import CloseIcon from './icons/CloseIcon'

const AlertsStyle = styled.div`
  position: fixed;
  left: 0;
  right: 0;
  top: 32px;
  bottom: 0;
  
  .alert {
    max-width: 600px;
    margin: 0 auto;
    padding: 12px 1rem;
    border-radius: 8px;
    margin-bottom: 12px;
    will-change: transform;
    animation: 0.5s slideIn;
    position: relative;
    font-weight: 500;
    opacity: 0.8;
    background-color: #ddffff;
    box-shadow: 2px 2px 4px -2px #008080;

    > p::first-letter {
      text-transform: capitalize;
    }
    
    &.info {
      background-color: #ddffff;
      box-shadow: 2px 2px 4px -2px #008080;
    }
    &.success {
      background-color: #ddffdd;
      box-shadow: 2px 2px 4px -2px #208000;
    }
    &.warning {
      background-color: #ffffcc;
      box-shadow: 2px 2px 4px -2px #808000;
    }
    &.error {
      background-color: #ffdddd;
      box-shadow: 2px 2px 4px -2px #800000;
    }

    button {
      appearance: none;
      background-color: transparent;
      border: none;
      position: absolute;
      top: 0;
      right: 0;
      padding: 3px;
      height: 20px;
      cursor: pointer;

      &:hover, &:focus {
        background-color: rgba(255,255,255, 0.25);
      }
    }
  }

  @keyframes slideIn {
    from {
      transform: translateY(-12px);
    }
    to {
      transform: translateY(0);
    }
  }
`
const ALERT_TIMEOUT = 3000

export function useAlerts () {
  const [alerts, setAlerts] = useGlobalSlice('alerts')
  const alertsRef = useRef(alerts)
  alertsRef.current = alerts

  function addAlert (alert) {
    setAlerts([...alertsRef.current, alert])
    setTimeout(() => {
      removeAlert(alert)
    }, ALERT_TIMEOUT)
  }

  function removeAlert (alert) {
    setAlerts(alertsRef.current.filter(a => a !== alert))
  }

  return [addAlert, removeAlert, alerts]
}

export default function Alerts () {
  const [socket] = useGlobalSlice('socket')
  const [addAlert, removeAlert, alerts] = useAlerts()

  useEffect(() => {
    socket.on('error', error => {
      addAlert({ text: `API error: ${error}`, className: 'error' })
    })
    socket.on('disconnect', () => {
      addAlert({ text: 'disconnected from server', className: 'warning' })
    })
    socket.on('reconnect', () => {
      addAlert({ text: 'connected again', className: 'success' })
    })

    return () => {
      socket.off('error')
      socket.off('disconnect')
      socket.off('reconnect')
    }
  }, [socket, addAlert])

  return (
    <AlertsStyle>
      {alerts.map((a, i) => (
        <Alert key={i} className={`alert ${a.className || 'info'}`}>
          <p>{a.text}</p>
          <button onClick={() => removeAlert(a)}>
            <CloseIcon width="14" height="14" />
          </button>
        </Alert>
      ))}
    </AlertsStyle>
  )
}
