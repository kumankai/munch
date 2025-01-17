import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { userService } from '../../services/userService';
import { toast } from 'react-toastify';
import { AxiosError } from 'axios';
import { useUser } from '../../context/UserContext';
import '../../styles/Settings.css';
import { UpdateError } from '../../types';

const Settings = () => {
    const navigate = useNavigate();
    const { setUser } = useUser();
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            toast.error('New passwords do not match');
            return;
        }

        try {
            await userService.updatePassword({
                password: newPassword,
                old_password: oldPassword
            });
            
            toast.success('Password updated successfully');
            
            // Clear form
            setOldPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } catch (error) {
            const axiosError = error as AxiosError<UpdateError>;
            if (axiosError.response?.status === 401) {
                toast.error(axiosError.response.data.message);
            } else {
                toast.error('Failed to update password');
            }
        }
    };

    const handleDeleteAccount = async () => {
        const confirmed = window.confirm(
            'Are you sure you want to delete your account? This action cannot be undone.'
        );

        if (confirmed) {
            try {
                await userService.deleteUser();
                setUser(null);
                toast.success('Account deleted successfully');
                navigate('/');
            } catch (error) {
                const axiosError = error as AxiosError<UpdateError>;
                if (axiosError.response?.status === 401) {
                    toast.error(axiosError.response.data.message);
                } else {
                    toast.error('Failed to delete account');
                }
            }
        }
    };

    return (
        <div className="settings-container">
            <div className="settings-content">
                <h1>Settings</h1>
                <div className="settings-card">
                    <h2>Change Password</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Current Password</label>
                            <input
                                type="password"
                                value={oldPassword}
                                onChange={(e) => setOldPassword(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>New Password</label>
                            <input
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Confirm New Password</label>
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                        </div>
                        <button type="submit" className="update-button">
                            Update Password
                        </button>
                    </form>
                </div>
                
                <div className="delete-account-section">
                    <button 
                        onClick={handleDeleteAccount}
                        className="delete-account-button"
                    >
                        Delete Account
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Settings;