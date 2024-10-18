import React, { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import {
  Card,
  CardBody,
  Col,
  Form,
  InputGroupText,
  Modal,
  ModalBody,
  ModalHeader,
  Row,
  Spinner
} from 'reactstrap'
import { addActivityAction, approveActivity, assignActivity } from '../../../utility/apis/activity'
import { FM, isValid, log } from '../../../utility/helpers/common'
import FormGroupCustom from '../../components/formGroupCustom'
import CenteredModal from '../../components/modal/CenteredModal'
import { useDispatch } from 'react-redux'
import { getPath } from '../../../router/RouteHelper'
import { loadUser } from '../../../utility/apis/userManagement'
import { monthDaysOptions, UserTypes } from '../../../utility/Const'
import { createAsyncSelectOptions, decrypt, getGenderImage } from '../../../utility/Utils'
import { addComments, loadComments } from '../../../utility/apis/comment'
import { useParams } from 'react-router'
import LoadingButton from '../../components/buttons/LoadingButton'
import Show from '../../../utility/Show'
import ReplyComment from './ReplyComment'
import { MessageSquare, Plus, Save, X } from 'react-feather'
import Hide from '../../../utility/Hide'
import { TrainRounded } from '@material-ui/icons'
import Shimmer from '../../components/shimmers/Shimmer'
import PerfectScrollbar from 'react-perfect-scrollbar'

export default function CommentModal({
  activity = null,
  setReload,
  scrollControl = true,
  edit = null,
  noView = false,
  showModal = false,
  setShowModal = () => {},
  Component = 'span',
  children = null,
  ...rest
}) {
  const [open, setOpen] = useState(null)
  const [editData, setEditData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [loadingReply, setLoadingReply] = useState(false)
  const [loadingDetails, setLoadingDetails] = useState(false)
  const [comments, setComments] = useState(null)
  const [commentValue, setCommentValue] = useState('')
  const [commentValue2, setCommentValue2] = useState('')
  const [user, setUser] = useState([])
  const [commentR, setCommentR] = useState(false)
  const dispatch = useDispatch()
  const [replyInput, setReplyInput] = useState(false)
  const [formVisible, setFormVisible] = useState(false)
  const form = useForm()
  const [reply, setReply] = useState(null)
  const {
    formState: { errors },
    handleSubmit,
    control,
    reset,
    setValue,
    watch,
    getValues
  } = form
  const chatArea = useRef(null)

  const showForm = (id) => {
    setFormVisible(id)
  }

  const handleModal = () => {
    setOpen(!open)
    setShowModal(!open)
    if (edit === null) setEditData(null)
  }

  const loadCommentData = () => {
    if (edit) {
      loadComments({
        jsonData: {
          source_id: edit,
          source_name: 'Activity'
        },
        loading: setLoadingDetails,
        success: (e) => {
          // const weeks = e?.is_repeat ? JSON.parse(e?.week_days)?.map(d => parseInt(d, 10)) : null
          // setWeekDaysSelected(weeks)
          // setCompanyData(e)
          setComments(e.payload)
        }
      })
    }
  }

  useEffect(() => {
    if (open) {
      loadCommentData()
    }
  }, [open])

  //     {
  //         comments?.reply.map((item, index) => {
  // console.log(item)
  //     })
  // }
  const handleClose = (from = null) => {
    handleModal()
  }

  const handleSave = (form) => {
    addComments({
      jsonData: {
        ...form,
        parent_id: '',
        source_id: edit,
        source_name: 'Activity'
      },
      loading: setLoading,
      dispatch,
      success: (data) => {
        // showForm()
        // setAdded(data?.payload?.id)
        // SuccessToast("done")
        // history.push(getPath("activity"))
        // handleModal()
        setCommentValue('')
        setCommentValue2('')
        reset()
        loadCommentData()
      }
    })
  }
  const handleReply = (form) => {
    if (isValid(form?.reply)) {
      addComments({
        jsonData: {
          ...form,
          comment: form?.reply,
          source_id: edit,
          source_name: 'Activity'
        },
        loading: (e) => setLoadingReply(form?.parent_id),
        dispatch,
        success: (data) => {
          // showForm()
          // setAdded(data?.payload?.id)
          // SuccessToast("done")
          // history.push(getPath("activity"))
          // handleModal()
          setCommentValue('')
          setCommentValue2('')

          reset()
          loadCommentData()
          showForm()
          setLoadingReply(null)
        },
        error: () => {
          setLoadingReply(null)
        }
      })
    } else {
      setFormVisible(null)
    }
  }

  useEffect(() => {
    if (showModal) handleModal()
  }, [showModal])
  // {comments?.reply.map((item, index) => {

  // }))}
  // console.log(comments?.reply)
  // console.log(edit)

  // {
  //     comments?.reply?.map((item, index) => {
  //         console.log(item)
  //     })
  // }
  const replies = (x) => {
    const re = []
    x?.reply_thread?.forEach((item, i) => {
      const avatar = getGenderImage(item?.comment_by?.gender)

      re.push(
        <>
          <Row noGutters className='mb-2'>
            <Col xs='2'>
              <img
                className='shadow rounded-circle me-2'
                src={avatar}
                style={{ width: 35, height: 35 }}
              />
            </Col>
            <Col xs='10'>
              <div className='mb-0'>
                <h6 className='fw-bold text-capitalize mb-1'>
                  {' '}
                  {decrypt(item?.comment_by?.name)}{' '}
                </h6>
                <p className='text-dark fw-bolder text-small-12'> {item?.comment} </p>
                {/* <Hide IF={formVisible === item?.id}>
                                    <a className='text-primary mb-2 d-block' onClick={(e) => {
                                        e.preventDefault()
                                        showForm(item?.id)
                                    }} >reply</a>
                                </Hide>
                                {replies(item)}
                                <Show IF={formVisible === item?.id}>
                                    <FormGroupCustom
                                        value={item?.id}
                                        control={control}
                                        type="hidden"
                                        name="parent_id"
                                        noLabel
                                        noGroup
                                        errors={errors}
                                        rules={{ required: true }}
                                    />
                                    <div class="animate__animated animate__fadeIn animate__faster mt-2 mb-2">
                                        <FormGroupCustom
                                            size=""
                                            control={control}
                                            autoFocus={true}
                                            placeholder={FM("")}
                                            type="text"
                                            name="reply"
                                            noLabel
                                            className='m-0 p-0'
                                            errors={errors}
                                            rules={{ required: false }}
                                            append={
                                                <>
                                                    <LoadingButton onClick={handleSubmit(handleReply)} tooltip={FM("reply")}
                                                        size="sm" color="primary">
                                                        <MessageSquare size="14" />
                                                    </LoadingButton>
                                                </>
                                            }
                                        />
                                    </div>
                                </Show> */}
              </div>
            </Col>
          </Row>
        </>
      )
    })
    return re
  }

  const ChatWrapper = comments?.length ? PerfectScrollbar : 'div'

  return (
    <>
      {!noView ? (
        <Component role='button' onClick={handleModal} {...rest}>
          {children}
        </Component>
      ) : null}
      <CenteredModal
        modalClass={'modal-md'}
        scrollControl
        loading={loading}
        open={open}
        handleModal={handleClose}
        handleSave={handleSubmit(handleSave)}
        title={`${FM('comment')}: ${activity?.title} `}
        footerComponent={
          <>
            {/* <Hide IF={formVisible !== null}> */}
            <Col md='12'>
              <FormGroupCustom
                label={'comment'}
                name={'comment'}
                type={'autocomplete'}
                errors={errors}
                className=''
                value={commentValue2}
                forceValue
                // key={commentValue}
                onChangeValue={(e) => {
                  setCommentValue2(e)
                }}
                control={control}
                rules={{ required: formVisible === null }}
              />
            </Col>
            <Col md='12'>
              <LoadingButton
                block
                disabled={!isValid(watch('comment'))}
                loading={loading}
                color='primary'
                onClick={handleSubmit(handleSave)}
              >
                {FM('comment')}
              </LoadingButton>
            </Col>
            {/* </Hide> */}
          </>
        }
      >
        <form>
          <CardBody>
            <Show IF={loadingDetails}>
              <Shimmer style={{ width: '100%', height: 50, marginBottom: 5 }} />
              <Shimmer style={{ width: '80%', height: 50, marginBottom: 5 }} />
              <Shimmer style={{ width: '100%', height: 50, marginBottom: 5 }} />
              <Shimmer style={{ width: '80%', height: 50, marginBottom: 5 }} />
            </Show>
            <Hide IF={loadingDetails}>
              <Show IF={comments?.length === 0}>{FM('no-comments-yet')}</Show>
              <ChatWrapper
                ref={chatArea}
                className='user-chats'
                options={{ wheelPropagation: false }}
              ></ChatWrapper>
              {comments?.map((item, index) => {
                const avatar = getGenderImage(item?.comment_by?.gender)

                return (
                  <>
                    <Row noGutters>
                      <Col xs='2'>
                        <img
                          className='shadow rounded-circle me-2'
                          src={avatar}
                          style={{ width: 35, height: 35 }}
                        />
                      </Col>
                      <Col xs='10'>
                        <div className=''>
                          <h6 className='fw-bold text-capitalize mb-1'>
                            {' '}
                            {decrypt(item?.comment_by?.name)}{' '}
                          </h6>
                          <p className='text-dark fw-bolder text-small-12'> {item?.comment} </p>
                          <p className='mt-2'>{replies(item)}</p>
                          <Hide IF={formVisible === item?.id}>
                            <a
                              className='text-primary mb-2 d-block'
                              onClick={(e) => {
                                e.preventDefault()
                                showForm(item?.id)
                              }}
                            >
                              reply
                            </a>
                          </Hide>
                          <Show IF={formVisible === item?.id}>
                            {/* <Form method='post' onSubmit={e => e.preventDefault()}> */}
                            <FormGroupCustom
                              value={item?.id}
                              control={control}
                              type='hidden'
                              name='parent_id'
                              noLabel
                              noGroup
                              errors={errors}
                              rules={{ required: true }}
                            />
                            <div class='animate__animated animate__fadeIn animate__faster mt-2 mb-2'>
                              <FormGroupCustom
                                control={control}
                                // autoFocus={true}
                                placeholder={FM('')}
                                type={'autocomplete'}
                                name='reply'
                                value={commentValue}
                                noLabel
                                onChangeValue={(e) => {
                                  setCommentValue(e)
                                }}
                                forceValue
                                className='m-0 p-0'
                                errors={errors}
                                rules={{ required: false }}
                              />

                              <LoadingButton
                                loading={loadingReply === item.id}
                                className='mt-1'
                                onClick={handleSubmit(handleReply)}
                                tooltip={FM('reply')}
                                size='sm'
                                color='primary'
                              >
                                <MessageSquare size='14' /> {FM('reply')}
                              </LoadingButton>
                            </div>
                            {/* </Form> */}
                          </Show>
                        </div>
                      </Col>
                    </Row>
                  </>
                )
              })}
            </Hide>
          </CardBody>
        </form>
      </CenteredModal>
    </>
  )
}
