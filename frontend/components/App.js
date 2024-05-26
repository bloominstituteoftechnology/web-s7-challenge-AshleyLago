import React from 'react'
import Home from './Home'
import Form from './Form'
import {Link, Routes, Route} from 'react-router-dom'

function App() {
  return (
    <div id="app">
      <nav>
        <Link to="/">Home</Link>&nbsp;
        <Link to="order">Order</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Home />}/>
        <Route path="order" element={<Form />}/>
      </Routes>
    </div>
  )
}

export default App
