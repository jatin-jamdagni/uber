import { FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router'; // Make sure to use `react-router-dom` here
import axios from 'axios';
import useCaptainContext from '../context/CaptainContext';
import { SignInResponse } from '../types';



const Captainlogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string>('');

  const { setCaptain } = useCaptainContext();
  const navigate = useNavigate();

  const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const captain = {
      email: email,
      password: password,
    };

    try {
      const response = await axios.post<SignInResponse>(`${import.meta.env.VITE_BASE_URL}/captain/signin`, captain);

      if (response.status === 200) {
        const data = response.data;

        setCaptain(data.captain!);
        localStorage.setItem('token', data.token);
        navigate('/captain-home');
      }
    } catch (error) {
      // Handle errors (e.g., invalid credentials)
      setError('Login failed. Please check your credentials and try again.');
    }

    setEmail('');
    setPassword('');
  };

  return (
    <div className="p-7 h-screen flex flex-col justify-between">
      <div>
        <img className="w-20 mb-3" src="https://www.svgrepo.com/show/505031/uber-driver.svg" alt="Uber Driver" />

        <form onSubmit={submitHandler}>
          <h3 className="text-lg font-medium mb-2">What's your email</h3>
          <input
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-[#eeeeee] mb-7 rounded-lg px-4 py-2 border w-full text-lg placeholder:text-base"
            type="email"
            placeholder="email@example.com"
          />

          <h3 className="text-lg font-medium mb-2">Enter Password</h3>
          <input
            required
            className="bg-[#eeeeee] mb-7 rounded-lg px-4 py-2 border w-full text-lg placeholder:text-base"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            placeholder="password"
          />

          <button
            type="submit"
            className="bg-[#111] text-white font-semibold mb-3 rounded-lg px-4 py-2 w-full text-lg placeholder:text-base"
          >
            Login
          </button>
        </form>

        {error && <p className="text-red-600 text-center">{error}</p>}

        <p className="text-center">
          Join a fleet? <Link to="/captain-signup" className="text-blue-600">Register as a Captain</Link>
        </p>
      </div>

      <div>
        <Link
          to="/login"
          className="bg-[#d5622d] flex items-center justify-center text-white font-semibold mb-5 rounded-lg px-4 py-2 w-full text-lg placeholder:text-base"
        >
          Sign in as User
        </Link>
      </div>
    </div>
  );
};

export default Captainlogin;
