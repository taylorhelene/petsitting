import 'bootstrap/dist/css/bootstrap.css';
import '../../App.css'
import { FcQuestions } from "react-icons/fc";
import {  useNavigate } from "react-router-dom";


function HeroPage(){
    const navigate = useNavigate();
    return(
        <div className='container'>
            <div className='background '>
                <div className='row p-4 text-info'>
                    <h1 className='col-md-8'>
                        Get A Trusted Petsitter While Away
                    </h1>
                </div>
                <div className='row p-4'>
                    <p className='col-md-6'>
                        While on vacation or business trip , get a trusted petsitter that would take care of
                        your pets. <br></br> Petsitters ensure pets get a warm treatment during the agreed 
                        period for the pet sitting arrangement.
                    </p>
                </div>

                <div className='row p-4'>
                    <p className='col-md-6'>
                       You care about your pets. We do too!
                    </p>
                    
                </div>
                <div className="col-md p-4 m-4 ">
                    <button className="text-nowrap btn btn-info btn-rounded rounded-pill"  onClick={()=> navigate("/signup")}>Try Now</button>
                </div>
            </div>
            <div className='container row m-2 py-4'>
                <img className='col-md-3 m-2 info' src={process.env.PUBLIC_URL + '/aboutus.png'}/>
                <div className='col-md-8 my-4 m-2'>
                    <p className='text-info'>Who are we?</p>
                    <h2 >About PetSitting</h2>
                    <p>We are pet owners , just like you. We love our pets and wish they are are taken care of
                        contantly even when we are not available. We provide a medium for pet owners and sitters
                        to communication and provision of pet sitting services. 
                        <br/>
                        Our in website messaging will be help you communicate. All users should provide images of
                        available pet foods and proof of pets being taken care of before an arrangement in order to 
                        ensure trust. 
                    </p>
                    <div className=' rounded p-4 bg-info-subtle border border-top-0 border-right-0 border-bottom-0 border-info border-5'>
                        <p>we may also provide escrow services to ensure that payments and services are 
                            completed according to the agreement
                        </p>
                    </div>
                    <div className="row m-2">
                        <div className='col-sm'>
                            <div className='row'>
                                <FcQuestions className='col-sm-2'/>
                                <p className='col-sm'>AI checks for image similarity</p>
                            </div>
                            <div className='row'>
                                <FcQuestions className='col-sm-2'/>
                                <p className='col-sm'>Escrow services</p>
                            </div>  
                        </div>
                        <div className='col-sm'>
                            <div className='row'>
                                <FcQuestions className='col-sm-2'/>
                                <p className='col-sm'>AI and admin checks for fraud</p>
                            </div>
                            <div className='row'>
                                <FcQuestions className='col-sm-2'/>
                                <p className='col-sm'>Real Time streaming of data to create reports</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default HeroPage;