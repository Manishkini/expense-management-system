import React from 'react';
import Modal from 'react-modal';
const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
  },
};
const CustomModal = ({ isOpen, closeModal, content, deleteRecord }) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={closeModal}
      ariaHideApp={false}
      style={customStyles}
    >
      {content}
      <div className="flex flex-row justify-evenly mt-4">
        <button
          className="border border-2 rounded-lg border-sky-500 px-6"
          onClick={() => {
            closeModal();
          }}
        >
          Close
        </button>
        <button
          className="bg-red-700 rounded-lg text-white px-6"
          onClick={() => {
            closeModal();
            deleteRecord();
          }}
        >
          Delete
        </button>
      </div>
    </Modal>
  );
};

export default CustomModal;
