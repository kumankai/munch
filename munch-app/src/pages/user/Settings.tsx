import { useState } from 'react';
import { userService } from '../../services/userService';
import { toast } from 'react-toastify';
import { AxiosError } from 'axios';
import '../../styles/Settings.css';
import { UpdateError } from '../../types';

const Settings = () => {
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
            </div>
        </div>
    );
};

export default Settings;