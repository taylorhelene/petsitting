import 'bootstrap/dist/css/bootstrap.css';
import '../../App.css'
import {  useNavigate } from "react-router-dom";



export default function SignUpForm(){
    return(
        <div className='container  border rounded p-4 '>
            <h1 className='text-center'>Sign Up</h1>
            <hr/>
            <div className='row container' >
        
                <div className='col-md' >
                    <img  src={process.env.PUBLIC_URL + '/avatar.png'} className='avatar rounded' />
                    <input type="file" name="image" className='m-2' align="center" ></input>
                </div>
                <div className='col-md '>
                    <div align='center' className='m-2'>
                        <label for="files" >Add six pictures. Three include you with pets. Three including you with pet foods:</label>
                        <div className='rounded m-2 p-4 border border-dotted border-2 '>
                            <input type="file" id="files" name="files" multiple />
                        </div>
                        
                        <br></br>
                    </div>
                    
                </div>
               
            </div>
           
            <div className='row ' >
                <div className='col-md-6'>
                    <label for="name">Name</label>
                    <input type="text" placeholder="Enter Full Name" name="name" id="name" required className='border-info-subtle rounded'/>
                </div>
                <div className='col-md-6 '>
                    <label for="email">Email</label>
                    <input type="text" placeholder="Enter Email" name="email" id="email" required className='border-info-subtle rounded'/>
                </div>
            </div>
            <div className='row' >
                <div className='col-md-6'>
                    <label for="city">City</label>
                    <input type="text" placeholder="Enter City" name="city" id="city" required className='border-info-subtle rounded'/>
                </div>
                <div className='col-md-6 '>
                    <label for="city">State</label>
                    <input type="text" placeholder="Enter City" name="city" id="city" required className='border-info-subtle rounded'/>
                </div>
            </div>
            <label for="location">Preference for pet sitting</label>
            <input type='text' placeholder="Either in house or petsitter's house" name="location" id="location" required className='border-info-subtle rounded'/>
            <label for="psw-repeat">Password</label>
            <input type="password" placeholder="Password" name="psw-repeat" id="psw-repeat" required className='border-info-subtle rounded'></input>
            <hr/>
            <div align="center">
                <p>By creating an account you agree to our <a href="#">Terms & Privacy</a>.</p>
                <button type="submit" class="text-center button btn  btn-info rounded">Register</button>
    

                <div class="container signin">
                    <p>Already have an account? <a href="#">Sign in</a>.</p>
                </div>
            </div>
            
        </div>
    )
}