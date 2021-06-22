import React from 'react'
import { QueryClientProvider, QueryClient } from 'react-query'
import Routes from '@/Routes'
import Header from '@/components/Header'
import { BrowserRouter as Router } from 'react-router-dom'
import { SocketProvider } from '@/lib/SocketProvider'

const apiClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false
    }
  }
})

export default function App() {
  return (
    <SocketProvider>
      <QueryClientProvider client={apiClient}>
        <Router>
          <div>
            <Header />
            <Routes />
          </div>
        </Router>
      </QueryClientProvider>
    </SocketProvider>
  )
}
