import axios from "./interceptors/axios";
import { useState } from "react";

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isAdmin, setIsAdmin] = useState(false);
    const [isUser, setIsUser] = useState(true); // By default, login as a user
    const [isRegistering, setIsRegistering] = useState(false); // State to track registration form visibility
    const [agreeTerms, setAgreeTerms] = useState(false);
    const [isForgotPassword, setIsForgotPassword] = useState(false); // State to track forgot password form visibility
    const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();

        // Login logic
        const user = {
            email: email,
            password: password,
            role: isAdmin ? 'admin' : 'normal_user' // Send role information to the backend
        };

        try {
            const { data } = await axios.post('http://localhost:8000/user/login/', user, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            localStorage.clear();
            localStorage.setItem('access_token', data.token['access']);
            localStorage.setItem('refresh_token', data.token['refresh']);
            localStorage.setItem('user_id', data['user_id']);
            localStorage.setItem('user_type', data.user_type);
            axios.defaults.headers.common['Authorization'] = `Bearer ${data.token['access']}`;

            // Redirect based on user type
            if (data.user_type === "admin") {
                window.location.href = '/admin';
            } else if (data.user_type === "normal_user") {
                window.location.href = '/user';
            } else {
                // Handle unknown user type
                console.error("Unknown user type:", data.user_type);
            }
        } catch (error) {
            alert("Username or password is incorrect");
            console.error("Login failed:", error);
            // Handle login error, e.g., display an error message to the user
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();

        // Registration logic
        const newUser = {
            name: name,
            email: email,
            password: password,
            password2: confirmPassword,
            tc: agreeTerms
            // Add any additional fields for registration as needed
        };

        try {
            const { data } = await axios.post('http://localhost:8000/user/register/', newUser, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            localStorage.clear();
            localStorage.setItem('access_token', data.token['access']);
            localStorage.setItem('refresh_token', data.token['refresh']);
            axios.defaults.headers.common['Authorization'] = `Bearer ${data.token['access']}`;
            console.log(localStorage)
            alert(data['msg']);
            setIsRegistering(false); // Hide registration form after successful registration
            window.location.href = '/user';
        }
        catch (error) {
            alert("Registration failed: " + error.message);
            console.error("Registration failed:", error);
            // Handle registration error, e.g., display an error message to the user
        }
    };

    const handleForgotPassword = async (e) => {
        e.preventDefault();

        // Send the email to your backend to handle the reset password email sending
        try {
            const { data } = await axios.post('http://localhost:8000/send-reset-password-email/', { email: forgotPasswordEmail }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            alert('Reset link has been sent to your email');
            setIsForgotPassword(false);
        } catch (error) {
            alert("Failed to send reset link: " + error.message);
            console.error("Forgot Password failed:", error);
            // Handle forgot password error, e.g., display an error message to the user
        }
    };

    return (
        <div className="Auth-form-container">
            {isForgotPassword ? (
                <form className="Auth-form" onSubmit={handleForgotPassword}>
                    <div className="Auth-form-content">
                        <h3 className="Auth-form-title">Forgot Password</h3>
                        <div className="form-group mt-3">
                            <label>Email</label>
                            <input
                                className="form-control mt-1"
                                placeholder="Enter your email"
                                name='Email'
                                type='email'
                                value={forgotPasswordEmail}
                                required
                                onChange={e => setForgotPasswordEmail(e.target.value)}
                            />
                        </div>
                        <div className="d-grid gap-2 mt-3">
                            <button type="submit" className="btn btn-primary">Send Reset Link</button>
                        </div>
                        <div className="mt-3">
                            <button className="btn btn-link" onClick={() => setIsForgotPassword(false)}>
                                Back to Login
                            </button>
                        </div>
                    </div>
                </form>
            ) : isRegistering ? (
                <form className="Auth-form" onSubmit={handleRegister}>
                    <div className="Auth-form-content">
                        <h3 className="Auth-form-title">Register</h3>
                        <div className="form-group mt-3">
                            <label>Name</label>
                            <input
                                className="form-control mt-1"
                                placeholder="Enter Name"
                                name='Name'
                                type='text'
                                value={name}
                                required
                                onChange={e => setName(e.target.value)}
                            />
                        </div>
                        <div className="form-group mt-3">
                            <label>Email</label>
                            <input
                                className="form-control mt-1"
                                placeholder="Enter Email"
                                name='Email'
                                type='text'
                                value={email}
                                required
                                onChange={e => setEmail(e.target.value)}
                            />
                        </div>
                        <div className="form-group mt-3">
                            <label>Password</label>
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
                            <label>Confirm Password</label>
                            <input
                                name='confirmPassword'
                                type="password"
                                className="form-control mt-1"
                                placeholder="Confirm password"
                                value={confirmPassword}
                                required
                                onChange={e => setConfirmPassword(e.target.value)}
                            />
                        </div>
                        <div className="form-group form-check mt-3">
                            <input
                                type="checkbox"
                                className="form-check-input"
                                id="agreeTerms"
                                checked={agreeTerms}
                                onChange={() => setAgreeTerms(!agreeTerms)}
                                required
                            />
                            <label className="form-check-label" htmlFor="agreeTerms">I agree to the terms and conditions</label>
                        </div>
                        <div className="d-grid gap-2 mt-3">
                            <button type="submit" className="btn btn-primary">Register</button>
                        </div>
                    </div>
                </form>
            ) : (
                <form className="Auth-form" onSubmit={handleLogin}>
                    <div className="Auth-form-content">
                        <h3 className="Auth-form-title">Sign In</h3>
                        <div className="form-group mt-3">
                            <label>Email</label>
                            <input
                                className="form-control mt-1"
                                placeholder="Enter Email"
                                name='Email'
                                type='text'
                                value={email}
                                required
                                onChange={e => setEmail(e.target.value)}
                            />
                        </div>
                        <div className="form-group mt-3">
                            <label>Password</label>
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
                        <div className="form-group form-check mt-3">
                            <input
                                type="checkbox"
                                className="form-check-input"
                                id="isAdmin"
                                checked={isAdmin}
                                onChange={() => {
                                    setIsAdmin(!isAdmin);
                                    setIsUser(false); // Uncheck the user checkbox when admin is selected
                                }}
                            />
                            <label className="form-check-label" htmlFor="isAdmin">Login as admin</label>
                        </div>
                        <div className="form-group form-check mt-3">
                            <input
                                type="checkbox"
                                className="form-check-input"
                                id="isUser"
                                checked={isUser}
                                onChange={() => {
                                    setIsUser(!isUser);
                                    setIsAdmin(false); // Uncheck the admin checkbox when user is selected
                                }}
                            />
                            <label className="form-check-label" htmlFor="isUser">Login as user</label>
                        </div>
                        <div className="d-grid gap-2 mt-3">
                            <button type="submit" className="btn btn-primary">Submit</button>
                        </div>
                        <div className="mt-1">
                            <button className="btn btn-link" onClick={() => setIsForgotPassword(true)}>
                                Forgot your password?
                            </button>
                        </div>
                    </div>
                </form>
            )}
            <div className="mt-1">
                <button className="btn btn-link" onClick={() => setIsRegistering(!isRegistering)}>
                    {isRegistering ? "Cancel Registration" : "Don't have an account? Register Here"}
                </button>
            </div>
        </div>
    );
};

export default Login;
