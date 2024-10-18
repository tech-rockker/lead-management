// import React, { useState } from 'react'
// import { X } from 'react-feather'
// import { useForm } from 'react-hook-form'
// import { useDispatch } from 'react-redux'
// import { Button, CustomInput, Form, FormGroup, Label, Modal, ModalBody, ModalFooter, ModalHeader, Spinner } from 'reactstrap'
// import { completeIp } from '../../../utility/apis/ip'

// const ReplyComment = ({edit,  commentR, setCommentR, handleReply}) => {
//     const [loading, setLoading] = useState(false)
//     const form = useForm()
//     const dispatch = useDispatch()

//     const { formState: { errors }, handleSubmit, control, reset, setValue, watch, getValues } = form

//     const handleSave = (form) => {
//         completeIp({
//             jsonData: {
//                 ...form,
//                 ip_id: edit?.id,
//                 status: "2"

//             },
//             loading: setLoading,
//             dispatch,
//             success: (data) => {
//                 handleReply()
//                 // showForm()
//                 // setAdded(data?.payload?.id)
//                 // SuccessToast("done")
//                 // history.push(getPath("activity"))
//                 // handleCompleteModal()
//             }

//         })
//     }
//     const CloseBtn = <X className='cursor-pointer' size={15} onClick={handleReply} />
//     return (
//     <Modal isOpen={open}
//     toggle={handleReply}
//     className='sidebar-sm'
//     // modalClassName='modal-slide-back'
//     // contentClassName='pt-0'
//     className='modal-dialog-centered'
//     size="md"
//     //  style={{ maxWidth: '500px', width: '100%' }}
//      >
//          <ModalBody>
//              <h1>hii</h1>
//          </ModalBody>

//     </Modal>
//   )
// }

// export default ReplyComment
