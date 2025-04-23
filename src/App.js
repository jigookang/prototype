import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PrettyPriceChecker from './PrettyPriceChecker';
import MainPage from './MainPage';
import EVSubsidy from './EVSubsidy';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/calculator" element={<PrettyPriceChecker />} />
          <Route path="/evsubsidy" element={<EVSubsidy />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
