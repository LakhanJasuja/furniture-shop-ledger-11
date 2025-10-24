import React, { useState } from 'react';
import { supabase } from '../../client/supabaseClient';

const AddBuyer = () => {
    const [newBuyer, setNewBuyer] = useState({
        name: '',
        email: '',
        phone: '',
        address: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState('');

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
                <h2>Add New Buyer</h2>
            </div>

            {message && (
                <div className={`message ${message.includes('Error') ? 'error' : 'success'}`}>
                    {message}
                </div>
            )}

            <form onSubmit={handleAddBuyer} className="add-buyer-form">
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
    );
};

export default AddBuyer;
