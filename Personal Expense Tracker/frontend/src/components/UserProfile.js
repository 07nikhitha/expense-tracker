import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const UserProfile = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState({
        name: '',
        email: '',
        password: '',
        type: 'private'
    });
    const userId = JSON.parse(localStorage.getItem('user'))._id;

    // Load user details from local storage
    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        if (storedUser) setUser(storedUser);
    }, []);

    // Handle input changes
    const handleChange = (e) => {
        setUser({
            ...user,
            [e.target.name]: e.target.value
        });
    };

    // Update user profile
    const handleUpdate = async () => {
        try {
            const response = await axios.put(`http://localhost:5000/updateUser/${userId}`, user);
            localStorage.setItem('user', JSON.stringify(response.data));
            alert('Profile updated successfully');
        } catch (error) {
            console.error('Error updating profile:', error);
            alert('Failed to update profile');
        }
    };

    // Delete user account
    const handleDeleteAccount = async () => {
        if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
            try {
                await axios.delete(`http://localhost:5000/deleteUser/${userId}`);
                localStorage.removeItem('user');
                localStorage.removeItem('budgetPlan');
                alert('Account deleted successfully');
                navigate('/');
            } catch (error) {
                console.error('Error deleting account:', error);
                alert('Failed to delete account');
            }
        }
    };

    // Inline CSS styles
    const containerStyle = {
        width: '60%', // Set width to 60% of the screen
        maxWidth: '800px', // Optional: add a max width for larger screens
        margin: 'auto',
        padding: '20px',
        border: '1px solid #ddd',
        borderRadius: '8px',
        backgroundColor: 'white', // White window background
        boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
    };

    const headerStyle = {
        textAlign: 'center',
        marginBottom: '20px',
    };

    const formStyle = {
        display: 'flex',
        flexDirection: 'column',
        gap: '15px',
    };

    const labelStyle = {
        fontWeight: 'bold',
        marginBottom: '5px', // Add space below labels
    };

    const inputStyle = {
        padding: '10px',
        border: '1px solid #ccc',
        borderRadius: '4px',
        width: '100%',
    };

    const buttonContainerStyle = {
        display: 'flex',
        justifyContent: 'space-between',
    };

    const buttonStyle = {
        padding: '10px 15px',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        transition: 'background-color 0.3s',
    };

    const updateButtonStyle = {
        ...buttonStyle,
        backgroundColor: '#4CAF50',
        color: 'white',
    };

    const deleteButtonStyle = {
        ...buttonStyle,
        backgroundColor: '#f44336',
        color: 'white',
    };

    return (
        <div style={{ backgroundColor: 'rgb(0, 123, 255)', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <div style={containerStyle}>
                <h2 style={headerStyle}>User Profile</h2>
                <form style={formStyle}>
                    <div>
                        <label style={labelStyle}>Name:</label>
                        <input
                            type="text"
                            name="name"
                            value={user.name}
                            onChange={handleChange}
                            style={inputStyle}
                        />
                    </div>
                    <div>
                        <label style={labelStyle}>Email:</label>
                        <input
                            type="email"
                            name="email"
                            value={user.email}
                            onChange={handleChange}
                            style={inputStyle}
                        />
                    </div>
                    <div>
                        <label style={labelStyle}>Password:</label>
                        <input
                            type="password"
                            name="password"
                            value={user.password}
                            onChange={handleChange}
                            style={inputStyle}
                        />
                    </div>
                    <div>
                        <label style={labelStyle}>Account Type:</label>
                        <select
                            name="type"
                            value={user.type}
                            onChange={handleChange}
                            style={inputStyle}
                        >
                            <option value="private">Private</option>
                            <option value="public">Public</option>
                        </select>
                    </div>
                    <div style={buttonContainerStyle}>
                        <button type="button" onClick={handleUpdate} style={updateButtonStyle}>Update Profile</button>
                        <button type="button" onClick={handleDeleteAccount} style={deleteButtonStyle}>Delete Account</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UserProfile;
