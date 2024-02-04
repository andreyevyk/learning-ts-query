import React from 'react'
import ReactDOM from 'react-dom/client'
import { QueryClient,QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { RouterProvider } from 'react-router-dom'
import { router } from './routes'
import "./index.css"

const queryClient = new QueryClient()

async function enableMocking() {
  if (process.env.NODE_ENV !== 'development') {
    return
  }
  const { worker } = await import('./mocks/browser')
 
  return worker.start({
    onUnhandledRequest: 'bypass',
  })
}


enableMocking().then(() => {
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
        <ReactQueryDevtools/>
      </QueryClientProvider>
    </React.StrictMode>,
  )
})


