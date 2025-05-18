import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { BrowserRouter, Route, Routes } from "react-router";
import { Landing } from './screens/Landing';
import { Game } from './screens/Game';

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className='bg-[#312e2b] min-h-screen h-full w-full'>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Landing />} />
          <Route path='/game' element={<Game />} />
        </Routes>
      </BrowserRouter>
      {/* <button className='bg-blue-500 p-2 '>Join room</button> */}
    </div>
  )
}

export default App
