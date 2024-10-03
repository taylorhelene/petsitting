import 'bootstrap/dist/css/bootstrap.css';
import {  useNavigate } from "react-router-dom";


function Footer(){
    const navigate = useNavigate();

    return(
        <footer className='bg-dark-subtle row p-4 m-1 footer  '>
            <img src={process.env.PUBLIC_URL + '/logo.png'} className='col-sm-2'></img>
            <div className='col-md-3'>
                <h6>Our Services</h6>
            </div>
            <div className='col-md-3'>
                <h6>Contact</h6>
            </div>
            <div className='col-md-3'>
                <h6>Payment</h6>
            </div>
            <hr class="rounded"></hr>
        </footer>
    )
}

export default Footer;