import React, { useEffect, useState } from 'react'
import { FM } from '../../../utility/helpers/common'
import CenteredModal from '../../components/modal/CenteredModal'
import ActivityCardLog from '../../log/ActivityCardLog'

const ActivityLogModal = ({
  showModal = false,
  setShowModal = () => {},
  activityId = null,
  Component = 'span',
  children = null
}) => {
  
  const [open, setOpen] = useState(showModal)

  useEffect(() => {
    setOpen(showModal)
  }, [showModal])

  const handleModal = () => {
    setOpen(!open)
    setShowModal(!open)
  }

  return (
    <>
      <CenteredModal
        disableFooter={true}
        title={`${FM(`log`)} ${FM(`details`)}`}
        modalClass={'modal-lg'}
        open={open}
        handleModal={handleModal}
      >
        <div className='p-2'>
          <ActivityCardLog id={activityId} />
        </div>
      </CenteredModal>
    </>
  )
}

export default ActivityLogModal
