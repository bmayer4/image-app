
import React from 'react'
import { Link } from 'react-router-dom';

const Landing = () => {
  return (
    <div className='main-header'>
    <div className="header-overlay text-center text-white">
        <div className="display-3 header-content header-content-title">Imagely</div>
        <p className="header-content header-paragraph">Your image community awaits you</p>
        <Link to='/explore'><div className="header-button btn btn-outline-light">Explore</div></Link>
    </div>
    </div>
  )
}

export default Landing;