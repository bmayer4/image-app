import React from 'react'
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router'
import { logoutUser } from '../../actions/auth';


const Header = ({ auth, logoutUser, history }) => {

    const onLogout = (e) => {
        e.preventDefault();
        logoutUser(); 
        history.push('/explore');
    }

    const authLinks = (
        <ul className="navbar-nav ml-auto">
        <li className="nav-item">
            <Link to='/explore' className="nav-link">Explore</Link>
        </li>
        <li className="nav-item">
        <Link to='/post/add' className="nav-link">Add Post</Link>
    </li>
        <li className="nav-item">
            <a href='' className="nav-link" onClick={onLogout}>Logout</a>
        </li>
    </ul>
    )

    const notAuthLinks = (
        <ul className="navbar-nav ml-auto">
        <li className="nav-item">
            <Link to='/explore' className="nav-link">Explore</Link>
        </li>
        <li className="nav-item">
            <Link to='/login' className="nav-link">Log In</Link>
        </li>
        <li className="nav-item">
            <Link to='/join' className="nav-link">Join Free</Link>
        </li>
    </ul>
    )

  return (
    <div>
    <nav className="navbar navbar-expand-md navbar-light py-3 navbar-custom">
    <div className="container">
    <Link to='/'>
        <div className="navbar-brand">
            <div className="brand-logo d-inline">Imagely</div>
        </div>
    </Link>
        <button className='navbar-toggler' data-toggle='collapse' data-target='#navbarCollapse'>
            <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarCollapse">
          { auth.isAuthenticated ? authLinks : notAuthLinks }
        </div>
    </div>
</nav>
</div>
  )
}

Header.propTypes = {
    logoutUser: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired
  }
  
  const mapStateToProps = (state) => {
    return {
      auth: state.auth
    }
  };
  
  const mapDispatchToProps = (dispatch) => ({
    logoutUser: () => dispatch( logoutUser()),
  });

  export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Header));


