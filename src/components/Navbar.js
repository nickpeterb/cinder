import {SignOut} from './SignInOut.js';
import { Link, useLocation } from "react-router-dom";

import './styles/Navbar.css';

export default function Navbar() {
    let location = useLocation();
    let path = location.pathname;
    
    return(<>
        <div className='navbar'>
            
            <Link to='/selector' className={path === '/selector' ? 'navlink active' : 'navlink'}>Home</Link>
            <Link to="/mymovies" className={path === '/mymovies' ? 'navlink active' : 'navlink'} >My Movies</Link>
            <Link to="/friends" className={path === '/friends' ? 'navlink active' : 'navlink'} >Friends</Link>
            
            <SignOut />
        </div>
    </>);
}