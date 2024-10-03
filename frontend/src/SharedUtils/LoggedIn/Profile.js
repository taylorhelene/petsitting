import 'bootstrap/dist/css/bootstrap.css';
import '../../App.css'
import {  useNavigate, NavLink } from "react-router-dom";

export default function Profile(){
    return(
        <div className='container'>
            <div className='row'>
                <div className='col-md-3 sidenav card m-2'>
                  
                    
                    <NavLink to="/profile" className='active '> Profile </NavLink>
                    <NavLink to="/messages" className=' inactive'> Messages </NavLink>
                    <NavLink to="/" className='inactive'> Images </NavLink>

                </div>
                <div className='col-md-9 row m-2 '>
                    
                    <div className='card col-md-6  p-4'>
                        <div align="center">
                            <img className='profile contain' src={process.env.PUBLIC_URL + '/aboutus.png'}></img>
                        </div>
                        <p>My profile </p>

                        <div className='row'>
                            <div className='col-sm'>
                                <p>Name</p>
                                <hr></hr>
                            </div>
                            <div className='col-sm'>
                                <p>Location</p>
                                <hr></hr>
                            </div>
                        </div>
                        <p>Email.com</p>
                        <hr></hr>
                        <div align="center">
                            <button className='btn btn-info btn-rounded rounded' align='center'> Edit </button>
                        </div>
                    </div>

                    <div className='col-md-6'>
                        <div className='card p-4 m-2'>
                            <div className='row'>
                                <p className='col-md-9'>My messages</p>
                                <button className=' btn btn-info btn-rounded rounded col-sm-3'>View</button>
                            </div>
                            <hr/>
                        </div>

                        <div className='card p-4 m-2'>
                            <div className='row'>
                                <p className='col-md-9'>My messages</p>
                                <button className=' btn btn-info btn-rounded rounded col-sm-3'>View</button>
                            </div>
                            <hr/>
                        </div>
                    </div>
                    
               
                </div>
            
            </div>
    
        </div>
    )
}