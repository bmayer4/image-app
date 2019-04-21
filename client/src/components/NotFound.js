
import React from 'react'
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="container">
      <h1 className="display-4">Page not found</h1>
      <p>Sorry, this page does not exist</p>
      <Link to='/'>Back to homepage</Link>
    </div>
  )
}

export default NotFound;