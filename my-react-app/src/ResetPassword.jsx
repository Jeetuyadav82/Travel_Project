// ResetPassword.js
import React, { useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const ResetPassword = () => {
    const { uid, token } = useParams();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setMessage('Passwords do not match');
            return;
        }

        try {
            await axios.post(`http://localhost:8000/reset-password/${uid}/${token}/`, {
                password: password,
            });
            alert('Password reset successful');
            window.location.href = '/user';
        }
        catch (error) {
            alert('Password reset failed');
        }
    };

    return (
        <form className="reset-password-form" onSubmit={handleSubmit}>
                <div className="Auth-form-content">
                    <h3 className="Auth-form-title">Reset Password</h3>
                    <div className="form-group mt-3">
                    <label>New Password:</label>
                    <input
                        name='password'
                        type="password"
                        className="form-control mt-1"
                        placeholder="Enter password"
                        value={password}
                        required
                        onChange={e => setPassword(e.target.value)}
                    />
                    </div>

                    <div className="form-group mt-3">
                    <label>confirm New Password</label>
                    <input
                        name='password'
                        type="password"
                        className="form-control mt-1"
                         placeholder="Enter password"
                        value={confirmPassword}
                        required
                        onChange={e => setConfirmPassword(e.target.value)}
                    />
                </div>
                <button type="submit" className="btn btn-primary">Reset Password</button>

        </div>
       </form>
    );
};

export default ResetPassword;
