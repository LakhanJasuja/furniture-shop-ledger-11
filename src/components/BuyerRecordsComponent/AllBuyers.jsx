import React, { useState, useEffect } from 'react';
import { supabase } from '../../client/supabaseClient';
import BuyerData from '../BuyerData';
import './AllBuyers.css';

const AllBuyers = () => {
    const [allBuyers, setAllBuyers] = useState([]);
    const [selectedBuyer, setSelectedBuyer] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetchAllBuyers();
    }, []);

    const fetchAllBuyers = async () => {
        setIsLoading(true);
        try {
            const { data, error } = await supabase
                .from('CustomersData')
                .select('id, name, phone, email, balance')
                .order('name', { ascending: true });

            if (error) {
                setMessage('Error fetching buyers: ' + error.message);
            } else {
                setAllBuyers(data);
                setMessage(data.length === 0 ? 'No buyers found' : `Found ${data.length} buyer(s)`);
            }
        } catch (err) {
            setMessage('Error fetching buyers: ' + err.message);
        }
        setIsLoading(false);
    };

    return (
        <div className="all-buyers-container">
            {/* Header Section */}
            <div className="all-buyers-header">
                <div className="header-content">
                    <div>
                        <h2 className="header-title">Customers</h2>
                        <p className="header-subtitle">Manage and view all customers information</p>
                    </div>
                    <button 
                        onClick={fetchAllBuyers} 
                        disabled={isLoading}
                        className="refresh-button"
                    >
                        {isLoading ? (
                            <>
                                <svg className="refresh-icon" fill="none" viewBox="0 0 24 24">
                                    <circle style={{ opacity: 0.25 }} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path style={{ opacity: 0.75 }} fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Loading...
                            </>
                        ) : (
                            <>
                                <svg className="refresh-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                                </svg>
                                Refresh
                            </>
                        )}
                    </button>
                </div>
            </div>

            {/* Message Alert */}
            {message && (
                <div className={`message-alert ${message.includes('Error') ? 'error' : 'success'}`}>
                    {message.includes('Error') ? (
                        <svg className="message-icon" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                    ) : (
                        <svg className="message-icon" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                    )}
                    <span>{message}</span>
                </div>
            )}

            {/* Buyers Table */}
            {allBuyers.length > 0 && (
                <div className="buyers-table-wrapper">
                    <div className="buyers-table-container">
                        <table className="buyers-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Name</th>
                                    <th>Phone</th>
                                    <th>Email</th>
                                    <th>Balance</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {allBuyers.map((buyer) => (
                                    <tr key={buyer.id}>
                                        <td>
                                            <span className="buyer-id">#{buyer.id}</span>
                                        </td>
                                        <td>
                                            <div className="buyer-name">{buyer.name}</div>
                                        </td>
                                        <td>
                                            <span className={`buyer-contact ${!buyer.phone ? 'na' : ''}`}>
                                                {buyer.phone || 'N/A'}
                                            </span>
                                        </td>
                                        <td>
                                            <span className={`buyer-contact ${!buyer.email ? 'na' : ''}`}>
                                                {buyer.email || 'N/A'}
                                            </span>
                                        </td>
                                        <td>
                                            <span className={`buyer-balance ${
                                                parseFloat(buyer.balance || 0) >= 0 ? 'positive' : 'negative'
                                            }`}>
                                                ₹{parseFloat(buyer.balance || 0).toFixed(2)}
                                            </span>
                                        </td>
                                        <td>
                                            <button 
                                                onClick={() => setSelectedBuyer(buyer)}
                                                className="view-transactions-btn"
                                            >
                                                View Transactions
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Transaction Details Modal */}
            {selectedBuyer && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h3 className="modal-title">Transactions for {selectedBuyer.name}</h3>
                            <button 
                                onClick={() => setSelectedBuyer(null)}
                                className="modal-close-btn"
                            >
                                <svg className="modal-close-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                                </svg>
                            </button>
                        </div>
                        <div className="modal-body">
                            <BuyerData buyerId={selectedBuyer.id} />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AllBuyers;
