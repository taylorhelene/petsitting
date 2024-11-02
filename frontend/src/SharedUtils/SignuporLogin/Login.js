import 'bootstrap/dist/css/bootstrap.css';
import '../../App.css'
import {  useNavigate } from "react-router-dom";
import { useState } from "react";



export default function Login(){

    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async () => {
        try {
            const response = await fetch('http://localhost:5000/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();
            if (response.ok) {
                // Store the full user object in localStorage
                localStorage.setItem('user', JSON.stringify(data.user));
                alert('Login successful');
                navigate("/profile");
            } else {
                alert(data.message);
            }
        } catch (error) {
            console.error('Error during login:', error);
            alert('Login failed');
        }
    };
    return(
        <div className='container row m-4 border rounded'>
            <div className='col-md-6'>
                <h1 className='text-center'>Log In</h1>
                <hr/>

                <label for="email">Email</label>
                <input type="text" placeholder="Enter Email" name="email" id="email" required className='border-info-subtle rounded'  value={email}
                    onChange={(e) => setEmail(e.target.value)}/>
                <label for="psw-repeat">Password</label>
                <input type="password" placeholder="Password" name="psw-repeat" id="psw-repeat" required className='border-info-subtle rounded'value={password}
                    onChange={(e) => setPassword(e.target.value)}
                ></input>
                <hr/>
                <div align="center">
                  
                    <button type="submit" class="text-center button btn  btn-info rounded "   onClick={handleLogin}>Log In</button>
        

                    <div class="container signin">
                        <p>Don't have an account? <a href="#">Sign Up</a>.</p>
                    </div>
                </div>
            </div>
            <video  className='col-md-6 signup'  loop autoplay="" muted>
                    <source className='signupimg1' src={process.env.PUBLIC_URL + '/signup.mp4'} type="video/mp4"/>
            </video> 
        </div>
    )
}