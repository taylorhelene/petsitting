import 'bootstrap/dist/css/bootstrap.css';
import '../../App.css'
import {  useNavigate } from "react-router-dom";


export default function Login(){

    const navigate = useNavigate();
    return(
        <div className='container row m-4 border rounded'>
            <div className='col-md-6'>
                <h1 className='text-center'>Log In</h1>
                <hr/>

                <label for="email">Email</label>
                <input type="text" placeholder="Enter Email" name="email" id="email" required className='border-info-subtle rounded'/>
                <label for="psw-repeat">Password</label>
                <input type="password" placeholder="Password" name="psw-repeat" id="psw-repeat" required className='border-info-subtle rounded'></input>
                <hr/>
                <div align="center">
                  
                    <button type="submit" class="text-center button btn  btn-info rounded " onClick={()=> navigate("/profile")}>Log In</button>
        

                    <div class="container signin">
                        <p>Don't have an account? <a href="#">Sign Up</a>.</p>
                    </div>
                </div>
            </div>
            <img src={process.env.PUBLIC_URL + '/signup.png'} className='col-md-6 signup' /> 
        </div>
    )
}