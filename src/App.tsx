import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css';
import FormPage from './components/FormPage';
import DistributerPage from './components/DistributerPage';
import ConsumerPage from './components/ConsumerPage';
import Login from './components/Login';
import { ToastContainer } from 'react-toastify';
import FormShowData from './components/FormShowData';


function App() {
  return (
    <div className="App">
      <BrowserRouter>
      <ToastContainer/>
        <Routes>
          <Route path='/Form'  element={ <FormPage /> } />
          <Route path='/FormShowData'  element={ <FormShowData /> } />
          <Route path='/Distributer'  element={ <DistributerPage /> } />
          <Route path='/Consumer'  element={ <ConsumerPage /> } />
          <Route path='/'  element={ <Login /> } />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
