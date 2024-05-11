import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Skincare from './component/Skincare';

function App() {
  const [count, setCount] = useState(0)


  return (
    <>
      <Skincare url={"http://localhost:5000/api"} />
    </>
  )
}

export default App
