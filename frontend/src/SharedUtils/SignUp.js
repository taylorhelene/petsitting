import 'bootstrap/dist/css/bootstrap.css';
import {  useNavigate } from "react-router-dom";
import { FcNext } from "react-icons/fc";
import './../App.css'

function SignUp(){
    const navigate = useNavigate();

    return(
        <div className='container'>
            <div className='row p-4'>
                <div className='col-md-6'>
                    <h3>
                        How do you want to use PetSitting website?
                    </h3>
                    <p>We'll personalize your sign up experience accordingly.</p>

                    <div className='row bg-body-tertiary p-2 m-2 rounded'>
                        <FcNext className='col-sm-2'/>
                        <div  className='col-sm'>
                            <p>I am here to hire a Pet Sitter</p>
                            <p>Communicate with our registered Sitters</p>
                        </div>
                    </div>
                    <div className='row bg-body-tertiary p-2 m-2 rounded'>
                        <FcNext className='col-sm-2'/>
                        <div  className='col-sm'>
                            <p>I am here to register as a Pet Sitter</p>
                            <p>Communicate with our registered Pet owners</p>
                        </div>
                    </div>

                    <button className='button btn  btn-info rounded ' onClick={()=> navigate("/signupuser")} >
                        Create Account
                    </button>
                </div>
                <img src={process.env.PUBLIC_URL + '/signup.png'} className='col-md-6 contain signup' /> 
            </div>
        </div>
    )
}

export default SignUp;