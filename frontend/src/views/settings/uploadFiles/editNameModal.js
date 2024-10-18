import React, { useState } from 'react'
import { Modal, ModalHeader, ModalBody, ModalFooter, Button, Input } from 'reactstrap'

const EditNameModal = ({
  display = true,
  scrollControl = true,
  id,
  isOpen,
  toggle,
  existingName,
  onUpdate
}) => {
  const [newName, setNewName] = useState(existingName)
  const [error, setError] = useState('')

  const handleUpdate = () => {
    if (newName.trim() === '') {
      setError('Please enter a new name for folder.')
      return
    }
    if (newName.trim() === existingName) {
      setError('You are entering an existing name for folder')
      return
    }

    // Clear any previous error messages
    setError('')

    // Trigger API with newName
    onUpdate(id, newName)
    toggle() // Close the modal
  }

  return (
    <Modal
      zIndex={isOpen ? '1050' : '1049'}
      wrapClassName={`animatedOpacity ${display ? '' : 'send-left'}`}
      backdrop='static'
      scrollable={scrollControl}
      keyboard={false}
      isVisible={isOpen}
      className={`modal-dialog-centered modal-lg ${isOpen ? 'visible' : ''}`}
      isOpen={isOpen}
      toggle={toggle}
    >
      <ModalHeader toggle={toggle}>Edit Name</ModalHeader>
      <ModalBody>
        <div className='mb-3'>
          <label htmlFor='existingName' className='form-label'>
            Existing Folder Name
          </label>
          <Input type='text' id='existingName' value={existingName} readOnly />
        </div>
        <div className='mb-3'>
          <label htmlFor='newName' className='form-label'>
            New Folder Name
          </label>
          <Input
            type='text'
            id='newName'
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
          />
          {error && <div className='text-danger'>{error}</div>}
        </div>
      </ModalBody>
      <ModalFooter>
        <Button color='primary' onClick={handleUpdate}>
          Update
        </Button>
        <Button color='secondary' onClick={toggle}>
          Cancel
        </Button>
      </ModalFooter>
    </Modal>
  )
}

export default EditNameModal
