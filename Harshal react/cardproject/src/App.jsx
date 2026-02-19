import { useState } from 'react'

import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <div className='card'>
      <img src='https://images.squarespace-cdn.com/content/v1/5e10bdc20efb8f0d169f85f9/09943d85-b8c7-4d64-af31-1a27d1b76698/arrow.png'></img>
      <p className='name'>BHATT HARSHAL</p>
      <p className='details'>ABSOLUTE PAGLU</p>
      <p>skills</p>
      <p>JAVASCRIPT,HTML,CSS,JS,REACT</p>
    </div>
    </>
  )
}

export default App
