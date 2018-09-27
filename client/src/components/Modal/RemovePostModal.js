import React from 'react';
import Modal from 'react-modal';

const RemovePostModal = (props) => {
  return (
    <Modal
    isOpen={props.modalOpen} 
    onRequestClose={props.closeModal}  
    contentLabel="Remove"
    closeTimeoutMS={200}
    className="Modal"
    overlayClassName="Overlay"
    ariaHideApp={false}
    >
    <h5 className="">Remove Post?</h5>
    <button className="btn btn-sm btn-info m-1" onClick={props.closeModal}>Cancel</button>
    <button className="btn btn-sm btn-danger m-1" onClick={props.removePost}>Remove</button>
    </Modal>
  )
}

export default RemovePostModal;