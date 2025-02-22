import React, { useContext } from 'react';
import { FaGoogle } from "react-icons/fa";
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { AuthContext } from '../provider/AuthProvider';
import axios from 'axios';
// import { Helmet } from 'react-helmet';

const Login = () => {
    const { signIn, setUser, googleAuth, email, setEmail } = useContext(AuthContext);

    const location = useLocation();
    const navigate = useNavigate();

    const showErrorAlert = (message) => {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: message,
        });
    };

    // Google login function
    const onClickForGoogle = () => {
        googleAuth()
            .then(result => {
                const userFromGoogle = result.user;
                console.log(userFromGoogle);
                setUser(userFromGoogle);

                Swal.fire({
                    icon: 'success',
                    title: 'Login Successfully!',
                    text: 'Welcome to Task Manager!',
                    confirmButtonText: 'Continue',
                })
                navigate('/');

                

                // Prepare user information for the database
                const userInfo = {
                    name: userFromGoogle.displayName,
                    email: userFromGoogle.email,
                    photo: userFromGoogle.photoURL,
                };

                axios.post('https://task-management-server-rust-seven.vercel.app/users', userInfo)
                    .then(res => {
                        if (res.data.insertedId) {
                            console.log('User added to the database');
                            Swal.fire({
                                icon: 'success',
                                title: 'Login Successfully!',
                                text: 'Welcome to Task Manager!',
                                confirmButtonText: 'Continue',
                            }).then(() => {
                                navigate(location?.state ? location.state : '/');
                            });
                        }
                    })
                    .catch(error => {
                        console.log('Error adding user to database:', error);
                        showErrorAlert(error.message);
                    });
            })
            .catch(error => {
                console.log(error.message);

                // Show error message with SweetAlert
                Swal.fire({
                    icon: 'error',
                    title: 'Login Failed',
                    text: 'Google login failed. Please try again later.',
                });
            });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const email = e.target.email.value;
        const password = e.target.password.value;
        console.log(email, password);

        signIn(email, password)
            .then(result => {
                const user = result.user;
                setUser(user);
                setEmail('');

                // Show success message with SweetAlert
                Swal.fire({
                    icon: 'success',
                    title: 'Login Successful',
                    text: 'You have successfully logged in!',
                });

                navigate(location?.state ? location.state : '/');
            })
            .catch(error => {
                console.log(error.message);

                // Show error message with SweetAlert
                Swal.fire({
                    icon: 'error',
                    title: 'Login Failed',
                    text: 'Login failed! Please check your credentials and try again.',
                });
            });
    };

    return (
        <div className="min-h-screen flex justify-center items-center bg-[#F3F3F3]">
            <div className="card bg-base-100 w-full max-w-lg shrink-0 rounded-none p-10 my-1">
                <h2 className="text-2xl font-semibold text-center">Login your account</h2>
                <form
                    onSubmit={handleSubmit}
                    className="card-body">
                    <div className="fieldset">
                        <label className="fieldset-label">
                            <span className="label-text">Email</span>
                        </label>
                        <input
                            name="email"
                            type="email"
                            placeholder="email"
                            className="input input-bordered  w-full"
                            required
                        />
                    </div>
                    <div className="fieldset">
                        <label className="label">
                            <span className="label-text">Password</span>
                        </label>
                        <input
                            name="password"
                            type="password"
                            placeholder="password"
                            className="input input-bordered  w-full"
                            required
                        />
                        <a className="label-text-alt link link-hover">
                            Forgot password?
                        </a>
                    </div>
                    <div className="fieldset mt-6">
                        <button className="btn btn-neutral rounded-none">Login</button>
                    </div>
                    <p className="text-center mt-6">
                        Don’t Have An Account? <Link className="text-red-500" to='/auth/register'>Register</Link>
                    </p>

                    <div className="text-center space-y-3">
                        <h2 className="text-center mt-10">Or, Log in with</h2>
                        <button className="btn"
                            onClick={onClickForGoogle}
                        >
                            <FaGoogle />
                            <span className="text-lg font-light">Google</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;
