import 'bootstrap/dist/css/bootstrap.css';
import {  useNavigate } from "react-router-dom";


function Header(){
    const navigate = useNavigate();

    return(
        <div className='container '> 
           <nav className="navbar navbar-inverse ">
            <div className="container-fluid">
                <div className="navbar-brand">
                    <img src={process.env.PUBLIC_URL + '/logo.png'} /> 
                </div>
                <div className="row">
                    <p className="col-sm" onClick={()=> navigate("/")}>Home</p>
                    <p className="col-sm" onClick={()=> navigate("/")}>Home</p>
                    <p className="col-sm" onClick={()=> navigate("/")}>Home</p>
                </div>
                <div className="navbar-nav navbar-right ">
                    <div className="flex row">
                        <div className=" col-sm">
                            <button  className="text-nowrap btn btn-info btn-rounded rounded-pill" onClick={()=> navigate("/login")} >Log In</button>
                        </div>
                        <div className="col-md">
                            <button className="text-nowrap btn btn-outline-info btn-rounded rounded-pill"  onClick={()=> navigate("/signup")}>Sign Up</button>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
        </div>
    )
}

export default Header;