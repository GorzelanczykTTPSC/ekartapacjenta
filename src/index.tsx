import React from 'react';
import ReactDOM from 'react-dom/client';
import 'react-datepicker/dist/react-datepicker.css'
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import MainPage from './MainPage';
import PatientPage from './PatientPage';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/patient/:id" element={<PatientPage />} />
      </Routes>
    </BrowserRouter>
);
