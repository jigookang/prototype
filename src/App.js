import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Box } from '@mui/material';
import EVSubsidy from './EVSubsidy';
import EVComparison from './EVComparison';
import MainSelection from './MainSelection';
import MainPage from './MainPage';
import PrettyPriceChecker from './PrettyPriceChecker';
import ChatConsole from './ConsolePage';
import OrderConsole from './OrderConsole';
import './App.css';

function App() {
  return (
    <Router>
      <Box>
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/evtools" element={<MainSelection />} />
          <Route path="/subsidy" element={<EVSubsidy />} />
          <Route path="/comparison" element={<EVComparison />} />
          <Route path="/calculator" element={<PrettyPriceChecker />} />
          <Route path="/chat" element={<ChatConsole />} />
          <Route path="/orders" element={<OrderConsole />} />
        </Routes>
      </Box>
    </Router>
  );
}

export default App;
