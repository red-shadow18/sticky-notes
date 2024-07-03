import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import StickyNotes from './StickyNotes'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <StickyNotes/>
    </>
  )
}

export default App
