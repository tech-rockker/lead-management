import React, { Fragment, useContext, useEffect, useRef, useState } from 'react'
import { List, Plus, Star, X } from 'react-feather'
import { useFieldArray, useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import { Link, useRouteMatch } from 'react-router-dom'
import {
  AccordionBody,
  AccordionHeader,
  AccordionItem,
  Button,
  Card,
  CardBody,
  Col,
  CustomInput,
  Form,
  FormGroup,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Row,
  Spinner,
  UncontrolledAccordion
} from 'reactstrap'
import { completeIp } from '../../../utility/apis/ip'
import { loadQuestion } from '../../../utility/apis/questions'
import { IconSizes } from '../../../utility/Const'
import { FM, isValid, isValidArray, log } from '../../../utility/helpers/common'
import FormGroupCustom from '../../components/formGroupCustom'
import BsTooltip from '../../components/tooltip'
import QuestionModal from './questionsModal'
import { ThemeColors } from '@src/utility/context/ThemeColors'
import { loadGroupQuestions } from '../../../utility/apis/commons'
import { isObjEmpty, SpaceTrim } from '../../../utility/Utils'
import { addFollowupComplete } from '../../../utility/apis/followup'
import IpApproval from '../ip/fragment/IpApproval'
import { viewUser } from '../../../utility/apis/userManagement'
import Show from '../../../utility/Show'
import Hide from '../../../utility/Hide'
import Shimmer from '../../components/shimmers/Shimmer'
import LoadingButton from '../../components/buttons/LoadingButton'
import SlideDown from 'react-slidedown'

const CompleteModal = ({
  onSuccess = () => {},
  followUp = null,
  completeModal,
  setCompleteModal,
  handleCompleteModal,
  open,
  setReload,
  edit
}) => {
  const [loading, setLoading] = useState(false)

  const dispatch = useDispatch()

  const CloseBtn = <X className='cursor-pointer' size={15} onClick={handleCompleteModal} />

  const [loadingDetails, setLoadingDetails] = useState(false)
  const [loadingSave, setLoadingSave] = useState(false)
  const [sp, setSelectedPersons] = useState([])

  const [questions, setQuestions] = useState([])

  const [user, setUser] = useState(null)

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    getValues,
    watch
  } = useForm({
    user_id: 'a'
  })

  const { fields, append, prepend, remove, swap, move, insert } = useFieldArray({
    control, // control props comes from useForm (optional: if you are using FormContext)
    name: 'more_witness' // unique name for your Field Array
  })

  const loadDetails = (id) => {
    if (isValid(id)) {
      viewUser({
        id,
        loading: setLoadingDetails,
        success: (d) => {
          setUser(d)
          setValue('user_id', d?.id)
        }
      })
    }
  }

  const loadQuestions = () => {
    loadGroupQuestions({
      loading: setLoading,
      jsonData: {
        is_visible: 1
      },
      success: (e) => {
        if (isValidArray(e?.payload)) {
          setQuestions(e?.payload)
        }
        // const x = []
        // e?.payload?.forEach((d, i) => {
        //     d?.questions?.forEach((c, o) => {
        //         x.push(c)
        //     })
        // })
        // setSelectQuestion(x)
      }
    })
  }

  useEffect(() => {
    if (open) {
      loadQuestions()
      loadDetails(followUp?.patient_implementation_plan?.patient?.id)
    }
  }, [followUp])

  const handleClose = () => {
    log('removed')
    remove()
    setQuestions([])
    setUser(null)
    setCompleteModal(!open)
  }

  const handleSave = (data) => {
    addFollowupComplete({
      jsonData: {
        ...data,
        // question_answer: [data],
        follow_up_id: followUp?.id,
        witness: isValidArray(sp) ? sp : []
      },
      loading: setLoadingSave,
      dispatch,
      success: (data) => {
        onSuccess(data?.payload)
        handleClose()
      }
    })
  }

  const handleQuestions = (q, type) => {
    log(type, q)
    if (type === 'saved') {
      let g = questions
      const gn = q?.group_name
      const gIndex = g?.findIndex((a) => a.group_name === gn)
      if (gIndex !== -1) {
        g[gIndex] = {
          group_name: gn,
          questions: [...g[gIndex]?.questions, ...[q]]
        }
      } else {
        g = [
          ...g,
          {
            group_name: gn,
            questions: [
              {
                ...q
              }
            ]
          }
        ]
      }
      log(g)
      setQuestions([...g])
    } else {
      if (isValidArray(q)) {
        let g = questions
        q?.forEach((qq) => {
          const gn = qq?.group_name
          const gIndex = g?.findIndex((a) => a.group_name === gn)
          if (gIndex !== -1) {
            g[gIndex] = {
              group_name: gn,
              questions: [...g[gIndex]?.questions, ...[qq]]
            }
          } else {
            g = [
              ...g,
              {
                group_name: gn,
                questions: [qq]
              }
            ]
          }
        })
        log(g)
        setQuestions([...g])
      }
    }
  }

  const renderQuestions = () => {
    const re = []
    let iz = -1
    if (questions?.length > 0) {
      questions?.forEach((group, index) => {
        re.push(
          <>
            <AccordionItem>
              <AccordionHeader className='mb-0' targetId={`g-${index}`}>
                <p className='text-capitalize mb-0 text-dark fw-bolder'>
                  <List size={17} /> <span className='align-middle'>{group?.group_name}</span>
                </p>
              </AccordionHeader>
              <AccordionBody className='pt-0' accordionId={`g-${index}`}>
                {group?.questions?.map((g, i) => {
                  iz++
                  return (
                    <>
                      <div className='m-1'>
                        <h6 className='text-dark text-capitalize fw-bold'>
                          {FM('Q')}
                          {i + 1}: {g?.question}
                        </h6>
                        <FormGroupCustom
                          noGroup
                          noLabel
                          value={g?.id}
                          type='hidden'
                          name={`question_answer.${iz}.question_id`}
                          className='mb-1'
                          control={control}
                          rules={{ required: false }}
                        />

                        <FormGroupCustom
                          noLabel
                          placeholder={`${FM('answer')} ${g?.question}`}
                          type='textarea'
                          name={`question_answer.${iz}.answer`}
                          className='mb-0'
                          control={control}
                          rules={{ required: false }}
                        />
                      </div>
                    </>
                  )
                })}
              </AccordionBody>
            </AccordionItem>
            {/* <div className='mb-2 border-bottom pb-2'>
                            <p className='text-uppercase text-secondary fw-bold text-small-12'>

                            </p>

                        </div> */}
          </>
        )
      })
    }
    return (
      <>
        <UncontrolledAccordion stayOpen defaultOpen='g-0'>
          {re}
        </UncontrolledAccordion>
      </>
    )
  }

  useEffect(() => {
    if (open) {
      append({
        first_name: '',
        last_name: ''
      })
    } else {
      remove()
    }
  }, [open])

  useEffect(() => {
    if (open !== null) {
      if (open === true) {
        setTimeout(() => {
          document.body.setAttribute('no-scroll', 1)
        }, 500)
      } else {
        document.body.removeAttribute('no-scroll')
      }
      const modal = document.getElementsByClassName('modal show')
      if (modal.length > 1) {
        setTimeout(() => {
          document.body.setAttribute('no-scroll', 1)
        }, 500)
      } else {
        // document.body.removeAttribute("no-scroll")
      }
    }
  }, [open])

  return (
    <Modal
      isOpen={open}
      toggle={handleClose}
      // modalClassName='modal-slide-back'
      // contentClassName='pt-0'
      className='modal-dialog-centered modal-xl'
    >
      <ModalHeader toggle={handleClose} close={CloseBtn} tag='div'>
        <h5 className='modal-title text-primary'> {FM('complete')} </h5>
      </ModalHeader>

      <ModalBody>
        <>
          <Form onSubmit={handleSubmit(handleSave)}>
            <Row>
              <Col md='7'>
                <Card className='white'>
                  <CardBody>
                    <Row>
                      <Col md='8' className='fw-bolder text-dark'>
                        {FM('questions')}
                      </Col>
                      <Col md='4' className='d-flex justify-content-end'>
                        <BsTooltip title={FM('add-question')}>
                          <QuestionModal onSuccess={handleQuestions}>
                            <Plus size={IconSizes.InputAddon} />
                          </QuestionModal>
                        </BsTooltip>
                      </Col>
                    </Row>
                  </CardBody>
                  <CardBody className='border-top p-0'>
                    <Show IF={loading}>
                      <div className='p-25'>
                        <Shimmer
                          style={{
                            height: 50,
                            margin: 5
                          }}
                        />
                        <Shimmer
                          style={{
                            height: 50,
                            margin: 5
                          }}
                        />
                        <Shimmer
                          style={{
                            height: 50,
                            margin: 5
                          }}
                        />
                        <Shimmer
                          style={{
                            height: 50,
                            margin: 5
                          }}
                        />
                      </div>
                    </Show>
                    <Hide IF={loading}>{renderQuestions()}</Hide>
                  </CardBody>
                </Card>
              </Col>
              <Col md='5'>
                <Card className='white'>
                  <CardBody>
                    <Row>
                      <Show IF={isValidArray(user?.persons)}>
                        <Col md='12' className='fw-bolder text-dark mb-5px'>
                          {FM('select-witness')}
                        </Col>
                        <Col md='12' className='fw-bolder text-dark'>
                          <Show IF={loading}>
                            <div className=''>
                              <Shimmer
                                style={{
                                  height: 50,
                                  margin: 5
                                }}
                              />
                              <Shimmer
                                style={{
                                  height: 50,
                                  margin: 5
                                }}
                              />
                              <Shimmer
                                style={{
                                  height: 50,
                                  margin: 5
                                }}
                              />
                              <Shimmer
                                style={{
                                  height: 50,
                                  margin: 5
                                }}
                              />
                            </div>
                          </Show>
                          <Hide IF={loadingDetails}>
                            <IpApproval
                              noComment
                              setSelectedPersons={setSelectedPersons}
                              noApproval
                              edit={user?.persons}
                              watch={watch}
                              control={control}
                              errors={errors}
                              setValue={setValue}
                            />
                          </Hide>
                        </Col>
                      </Show>
                      <Col md='12' className='fw-bolder text-dark mt-1'>
                        <FormGroupCustom
                          type={'autocomplete'}
                          control={control}
                          errors={errors}
                          rules={{
                            required: true,
                            validate: (v) => {
                              return isValid(v) ? !SpaceTrim(v) : true
                            }
                          }}
                          name='comment'
                          className='mb-1'
                          label={FM('comment')}
                        />
                      </Col>
                      <Col md='12'>
                        <p className='mb-0 text-dark fw-bolder'>{FM('more-witness')} :-</p>
                      </Col>
                    </Row>
                    {fields.map((field, i) => (
                      <>
                        <div key={field?.id} className='mb-1'>
                          <Row>
                            <Col md='5' className='fw-bolder text-dark mt-1'>
                              <FormGroupCustom
                                type={'text'}
                                control={control}
                                errors={errors}
                                onChangeValue={(e) => {}}
                                rules={{ required: false }}
                                name={`more_witness.${i}.first_name`}
                                className='mb-1'
                                label={FM('first-name')}
                              />
                            </Col>
                            <Col md='5' className='fw-bolder text-dark mt-1'>
                              <FormGroupCustom
                                type={'text'}
                                control={control}
                                errors={errors}
                                rules={{ required: false }}
                                className='mb-1'
                                name={`more_witness.${i}.last_name`}
                                label={FM('last-name')}
                              />
                            </Col>
                            <Col
                              md='2'
                              className='d-flex align-items-center justify-content-end mt-1'
                            >
                              <Show IF={!edit}>
                                <Show IF={fields.length - 1 === i}>
                                  <BsTooltip
                                    Tag={Plus}
                                    title={FM('new-date')}
                                    size={18}
                                    className='me-1'
                                    role='button'
                                    color='green'
                                    onClick={() => {
                                      append({
                                        first_name: '',
                                        last_name: ''
                                      })
                                    }}
                                  />
                                </Show>
                                <Hide IF={i === 0}>
                                  <BsTooltip
                                    Tag={X}
                                    title={FM('remove')}
                                    size={18}
                                    color='red'
                                    role='button'
                                    className=''
                                    onClick={(e) => {
                                      remove(i)
                                    }}
                                  />
                                </Hide>
                              </Show>
                            </Col>
                          </Row>
                        </div>
                      </>
                    ))}
                  </CardBody>
                </Card>
              </Col>
            </Row>
            <div className='text-end'>
              <LoadingButton loading={loadingSave} type='submit' color='primary'>
                {FM('complete')}
              </LoadingButton>
            </div>
          </Form>
        </>
      </ModalBody>
    </Modal>
  )
}

export default CompleteModal
