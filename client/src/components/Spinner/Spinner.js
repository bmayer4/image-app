import React from 'react';
import Loader from 'react-loader-spinner';

const Spinner = () => {
  return (
    <div style={{ textAlign: 'center', margin: '0 auto' }}>
    <Loader 
    type="ThreeDots"
    color="#00BFFF"
    height="70"	
    width="70"
 />   
    </div>
  )
}

export default Spinner;