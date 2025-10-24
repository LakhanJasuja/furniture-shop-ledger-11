import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar';
import CashRecords from './components/CashRecords';
import BankRecords from './components/BankRecords';
import RecordTransaction from './components/RecordTransaction';
import SellerRecords from './components/SellerRecords';
import AddBuyer from './components/BuyerRecordsComponent/AddBuyer';
import AllBuyers from './components/BuyerRecordsComponent/AllBuyers';
import SearchBuyerData from './components/BuyerRecordsComponent/SearchBuyerData';
import CashBook from './components/CashBookComponent/CashBook';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<CashBook />} />
            <Route path="/cash-records" element={<CashRecords />} />
            <Route path="/bank-records" element={<BankRecords />} />
            <Route path="/record-transaction" element={<RecordTransaction />} />
            <Route path="/seller-records" element={<SellerRecords />} />
            <Route path="/customer-records/add-buyer" element={<AddBuyer />} />
            <Route path="/customer-records/customers" element={<AllBuyers />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
