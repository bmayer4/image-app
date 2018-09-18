import React from 'react'
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <div>
    <nav className="navbar navbar-expand-md navbar-light py-4 navbar-custom">
    <div className="container">
    <Link to='/'>
        <div className="navbar-brand">
            <div className="brand-logo d-inline">Image App</div>
        </div>
    </Link>
        <button className='navbar-toggler' data-toggle='collapse' data-target='#navbarCollapse'>
            <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarCollapse">
            <ul className="navbar-nav ml-auto">
                <li className="nav-item">
                    <Link to='/explore' className="nav-link">Explore</Link>
                </li>
                <li className="nav-item">
                <Link to='/post/add' className="nav-link">Add Post</Link>
            </li>
                <li className="nav-item">
                    <Link to='/login' className="nav-link">Log In</Link>
                </li>
                <li className="nav-item">
                    <Link to='/join' className="nav-link">Join Free</Link>
                </li>
            </ul>
        </div>
    </div>
</nav>
</div>
  )
}

export default Header;

