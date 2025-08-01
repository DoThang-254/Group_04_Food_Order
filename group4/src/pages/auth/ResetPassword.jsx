import React, { useState } from 'react';
import { checkEmail, checkEmailForgot, removeRequest, updateUser } from '../../services/users';
import { hashPassword } from '../../data/util';

const ResetPassword = () => {
    const [email, setEmail] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [msg, setMsg] = useState('');
    const handleReset = async () => {
        try {
            const check = await checkEmailForgot(email);
            if (!check) {
                setMsg("You have not requested a reset or link expired.");
                return;
            }
            const userRes = await checkEmail(email);

            if (!userRes[0]) {
                setMsg("User not found.");
                return;
            }
            const user = userRes[0];
            const hash = await hashPassword(newPassword)
            await updateUser( user.id , {
                password: hash
            })

          
            await removeRequest(check[0].id);
            setMsg("Password reset successfully!");
        } catch (err) {
            setMsg("Something went wrong.");
        }
    };

    return (
        <div className="container mt-5" style={{ maxWidth: "400px" }}>
            <h3>Reset Password</h3>
            <div className="mb-3">
                <label>Email</label>
                <input
                    type="email"
                    className="form-control"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
            </div>
            <div className="mb-3">
                <label>New Password</label>
                <input
                    type="password"
                    className="form-control"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                />
            </div>
            <button className="btn btn-success" type="submit"
                onClick={handleReset}
            >Reset</button>
            {msg && <div className="mt-3 text-info">{msg}</div>}
        </div>
    );
};

export default ResetPassword;