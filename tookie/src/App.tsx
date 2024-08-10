import { RouterProvider } from 'react-router-dom'
import router from './router';
import { GlobalProvider } from './GlobalState';

function App() {
  return (
    <GlobalProvider>
    <RouterProvider router={router} />
    </GlobalProvider>
  )
}

export default App
