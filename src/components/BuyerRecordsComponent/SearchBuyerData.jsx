import React, { useState } from 'react';
import { supabase } from '../../client/supabaseClient';
import BuyerData from '../BuyerData';

const SearchBuyerData = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [selectedBuyer, setSelectedBuyer] = useState(null);
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

    return (
        <div className="buyer-records">
            <div className="buyer-records-header">
                <h2>Search Buyer's Data</h2>
            </div>

            {message && (
                <div className={`message ${message.includes('Error') ? 'error' : 'success'}`}>
                    {message}
                </div>
            )}

            <div className="search-section">
                <div className="search-input-group">
                    <input
                        type="text"
                        placeholder="Search by name, email, or phone..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="search-input"
                        onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
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
    );
};

export default SearchBuyerData;
