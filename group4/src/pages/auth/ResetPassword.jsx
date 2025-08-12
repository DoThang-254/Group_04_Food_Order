import React, { useContext } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { checkEmail, checkEmailForgot, removeRequest, updateUser } from '../../services/users';
import { hashPassword } from '../../data/util';
import { themeContext } from '../../context/ThemeContext';

const ResetPassword = () => {
    const { theme } = useContext(themeContext);

    const formik = useFormik({
        initialValues: {
            email: '',
            newPassword: '',
            confirmPassword: ''
        },
        validationSchema: Yup.object({
            email: Yup.string()
                .email("Invalid email format")
                .required("Email is required"),
            newPassword: Yup.string()
                .min(6, "Password must be at least 6 characters")
                .required("New password is required"),
            confirmPassword: Yup.string()
                .oneOf([Yup.ref('newPassword'), null], "Passwords do not match")
                .required("Confirm password is required")
        }),
        onSubmit: async (values, { setSubmitting, setStatus }) => {
            try {
                const check = await checkEmailForgot(values.email);
                if (!check) {
                    setStatus("You have not requested a reset or link expired.");
                    return;
                }

                const userRes = await checkEmail(values.email);
                if (!userRes[0]) {
                    setStatus("User not found.");
                    return;
                }

                const user = userRes[0];
                const hash = await hashPassword(values.newPassword);
                await updateUser(user.id, { password: hash });

                await removeRequest(check[0].id);
                setStatus("Password reset successfully!");
            } catch (err) {
                setStatus("Something went wrong.");
            } finally {
                setSubmitting(false);
            }
        }
    });

    const containerStyle = {
        backgroundColor: theme === 'dark' ? '#1e1e1e' : '#fff',
        color: theme === 'dark' ? '#fff' : '#000',
        padding: '30px',
        borderRadius: '10px',
        boxShadow: theme === 'dark' ? '0 0 10px #aaa' : '',
    };
    const containerStyleBorder = {
        backgroundColor: theme === 'dark' ? '#1e1e1e' : '#fff',
        color: theme === 'dark' ? '#fff' : '#000',
        padding: '30px',
    };
    const inputStyle = {
        backgroundColor: theme === 'dark' ? '#333' : '#fff',
        color: theme === 'dark' ? '#fff' : '#000',
        border: theme === 'dark' ? '1px solid #555' : '1px solid #ccc',
    };

    return (
        <div className="container mt-5" style={{ maxWidth: "400px", ...containerStyleBorder }}>
            <div style={containerStyle}>
                <h3>Reset Password</h3>

                <form onSubmit={formik.handleSubmit}>
                    <div className="mb-3">
                        <label>Email</label>
                        <input
                            type="email"
                            className="form-control"
                            style={inputStyle}
                            {...formik.getFieldProps('email')}
                        />
                        {formik.touched.email && formik.errors.email && (
                            <div className="text-danger">{formik.errors.email}</div>
                        )}
                    </div>

                    <div className="mb-3">
                        <label>New Password</label>
                        <input
                            type="password"
                            className="form-control"
                            style={inputStyle}
                            {...formik.getFieldProps('newPassword')}
                        />
                        {formik.touched.newPassword && formik.errors.newPassword && (
                            <div className="text-danger">{formik.errors.newPassword}</div>
                        )}
                    </div>

                    <div className="mb-3">
                        <label>Confirm Password</label>
                        <input
                            type="password"
                            className="form-control"
                            style={inputStyle}
                            {...formik.getFieldProps('confirmPassword')}
                        />
                        {formik.touched.confirmPassword && formik.errors.confirmPassword && (
                            <div className="text-danger">{formik.errors.confirmPassword}</div>
                        )}
                    </div>

                    <button
                        className="btn btn-danger"
                        type="submit"
                        disabled={formik.isSubmitting}
                    >
                        {formik.isSubmitting ? "Processing..." : "Reset"}
                    </button>

                    {formik.status && (
                        <div className="mt-3 text-info">{formik.status}</div>
                    )}
                </form>
            </div>
        </div>
    );
};

export default ResetPassword;
