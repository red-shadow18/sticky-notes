import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import StickyNotes from './StickyNotes'
import axios from 'axios'

function App() {
  const [count, setCount] = useState(0)



useEffect(()=>{
  const maxX = window.innerWidth - 250;
  const maxY = window.innerHeight - 250;

  axios.post('http://localhost:8081/api/saveScreenDimensions',{
    width:maxX,
    height:maxY
  }).then((response)=>{
    console.log(response)
  }).catch((error)=>{
    console.error(error)
  })
},[])


  return (
    <>
      <StickyNotes/>
    </>
  )
}

export default App
