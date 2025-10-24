import React, { useState } from 'react';
import { supabase } from '../../client/supabaseClient';
import BuyerData from '../BuyerData';
import './BuyerRecords.css';

const BuyerRecords = () => {
    const [activeTab, setActiveTab] = useState('search');
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [selectedBuyer, setSelectedBuyer] = useState(null);
    const [newBuyer, setNewBuyer] = useState({
        name: '',
        email: '',
        phone: '',
        address: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState('');

    const handleSearch = async () => {
        if (!searchTerm.trim()) {
            setMessage('Please enter a search term');
            return;
        }

        setIsLoading(true);
        try {
            const { data, error } = await supabase
                .from('buyers')
                .select('*')
                .or(`name.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%,phone.ilike.%${searchTerm}%`);

            if (error) {
                setMessage('Error searching buyers: ' + error.message);
            } else {
                setSearchResults(data);
                setMessage(data.length === 0 ? 'No buyers found' : `Found ${data.length} buyer(s)`);
            }
        } catch (err) {
            setMessage('Error searching buyers: ' + err.message);
        }
        setIsLoading(false);
    };

    const handleAddBuyer = async (e) => {
        e.preventDefault();
        if (!newBuyer.name.trim()) {
            setMessage('Buyer name is required');
            return;
        }

        setIsLoading(true);
        try {
            const { data, error } = await supabase
                .from('buyers')
                .insert([newBuyer])
                .select();

            if (error) {
                setMessage('Error adding buyer: ' + error.message);
            } else {
                setMessage('Buyer added successfully!');
                setNewBuyer({ name: '', email: '', phone: '', address: '' });
            }
        } catch (err) {
            setMessage('Error adding buyer: ' + err.message);
        }
        setIsLoading(false);
    };

    const handleInputChange = (e) => {
        setNewBuyer({
            ...newBuyer,
            [e.target.name]: e.target.value
        });
    };

    return (
        <div className="buyer-records">
            <div className="buyer-records-header">
                <h2>Customer Records</h2>
                <div className="tab-buttons">
                    <button 
                        className={`tab-button ${activeTab === 'search' ? 'active' : ''}`}
                        onClick={() => setActiveTab('search')}
                    >
                        Search Buyers
                    </button>
                    <button 
                        className={`tab-button ${activeTab === 'add' ? 'active' : ''}`}
                        onClick={() => setActiveTab('add')}
                    >
                        Add New Buyer
                    </button>
                </div>
            </div>

            {message && (
                <div className={`message ${message.includes('Error') ? 'error' : 'success'}`}>
                    {message}
                </div>
            )}

            {activeTab === 'search' && (
                <div className="search-tab">
                    <div className="search-section">
                        <div className="search-input-group">
                            <input
                                type="text"
                                placeholder="Search by name, email, or phone..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="search-input"
                            />
                            <button 
                                onClick={handleSearch} 
                                disabled={isLoading}
                                className="search-button"
                            >
                                {isLoading ? 'Searching...' : 'Search'}
                            </button>
                        </div>
                    </div>

                    {searchResults.length > 0 && (
                        <div className="search-results">
                            <h3>Search Results</h3>
                            <div className="buyers-list">
                                {searchResults.map((buyer) => (
                                    <div key={buyer.id} className="buyer-card">
                                        <div className="buyer-info">
                                            <h4>{buyer.name}</h4>
                                            <p>Email: {buyer.email || 'N/A'}</p>
                                            <p>Phone: {buyer.phone || 'N/A'}</p>
                                            <p>Address: {buyer.address || 'N/A'}</p>
                                        </div>
                                        <button 
                                            onClick={() => setSelectedBuyer(buyer)}
                                            className="view-transactions-button"
                                        >
                                            View Transactions
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {selectedBuyer && (
                        <div className="buyer-transactions">
                            <div className="transactions-header">
                                <h3>Transactions for {selectedBuyer.name}</h3>
                                <button 
                                    onClick={() => setSelectedBuyer(null)}
                                    className="close-button"
                                >
                                    Close
                                </button>
                            </div>
                            <BuyerData buyerId={selectedBuyer.id} />
                        </div>
                    )}
                </div>
            )}

            {activeTab === 'add' && (
                <div className="add-tab">
                    <form onSubmit={handleAddBuyer} className="add-buyer-form">
                        <h3>Add New Buyer</h3>
                        <div className="form-group">
                            <label htmlFor="name">Name *</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={newBuyer.name}
                                onChange={handleInputChange}
                                required
                                className="form-input"
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="email">Email</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={newBuyer.email}
                                onChange={handleInputChange}
                                className="form-input"
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="phone">Phone</label>
                            <input
                                type="tel"
                                id="phone"
                                name="phone"
                                value={newBuyer.phone}
                                onChange={handleInputChange}
                                className="form-input"
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="address">Address</label>
                            <textarea
                                id="address"
                                name="address"
                                value={newBuyer.address}
                                onChange={handleInputChange}
                                rows="3"
                                className="form-textarea"
                            />
                        </div>
                        <button 
                            type="submit" 
                            disabled={isLoading}
                            className="submit-button"
                        >
                            {isLoading ? 'Adding...' : 'Add Buyer'}
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default BuyerRecords;
