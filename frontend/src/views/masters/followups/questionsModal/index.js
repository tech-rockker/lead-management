import React, { useContext, useEffect, useState } from 'react'
import { ArrowRight, Plus, Send } from 'react-feather'
import { useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import { Link, useParams, useRouteMatch } from 'react-router-dom'
import {
  Button,
  ButtonGroup,
  Card,
  CardBody,
  Col,
  Form,
  InputGroupText,
  Label,
  Row
} from 'reactstrap'
import { loadGroupQuestions } from '../../../../utility/apis/commons'
import { addFollowupComplete } from '../../../../utility/apis/followup'

import { loadRole } from '../../../../utility/apis/roles'
import { addUser, editUser, loadUser, viewUser } from '../../../../utility/apis/userManagement'
import { IconSizes, UserTypes } from '../../../../utility/Const'
import { FM, isValid, isValidArray, log } from '../../../../utility/helpers/common'
import { ThemeColors } from '@src/utility/context/ThemeColors'
import {
  createAsyncSelectOptions,
  createSelectOptions,
  isObjEmpty,
  SuccessToast,
  toggleArray,
  updateRequiredOnly
} from '../../../../utility/Utils'
import FormGroupCustom from '../../../components/formGroupCustom'
import CenteredModal from '../../../components/modal/CenteredModal'
import Shimmer from '../../../components/shimmers/Shimmer'
import MoreQuestion from './AddMoreQuestionModal'
import BsTooltip from '../../../components/tooltip'
import Header from '../../../header'
import { addQuestion, loadQuestion } from '../../../../utility/apis/questions'
import Show from '../../../../utility/Show'
import { Permissions } from '../../../../utility/Permissions'
import Hide from '../../../../utility/Hide'
import { ArrowLeft } from '@material-ui/icons'

const QuestionModal = ({
  followupsData = null,
  scrollControl = true,
  userType = null,
  onSuccess = () => {},
  edit = null,
  noView = false,
  handleToggle = () => {},
  showModal = false,
  setShowModal = () => {},
  userId = null,
  Component = 'span',
  children = null,
  ...rest
}) => {
  const [open, setOpen] = useState(null)
  const { colors } = useContext(ThemeColors)
  const [editData, setEditData] = useState(null)
  const [filter, setFiltr] = useState(1)
  const [data, setData] = useState([])
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(false)
  const [loadingDetails, setLoadingDetails] = useState(false)
  //group question
  const [questions, setQuestions] = useState([])
  const [selectQuestion, setSelectQuestion] = useState(['a'])

  const [view, setView] = useState(null)

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    getValues,
    watch
  } = useForm()

  const loadQuestions = () => {
    loadGroupQuestions({
      loading: setLoading,
      jsonData: {
        is_visible: 'no'
      },
      success: (e) => {
        const q = []
        const x = []
        if (isValidArray(e?.payload)) {
          e?.payload?.forEach((qe) => {
            q.push({
              label: qe?.group_name,
              options: createSelectOptions(qe?.questions, 'question', 'id')
            })
          })
          e?.payload?.forEach((d, i) => {
            d?.questions?.forEach((c, o) => {
              x.push(c)
            })
          })
        }
        setQuestions(x)
        setSelectQuestion(q)
      }
    })
  }

  useEffect(() => {
    loadQuestions()
  }, [])

  useEffect(() => {
    handleToggle(open)
    setData(followupsData?.questions)
  }, [open])

  const handleModal = () => {
    setOpen(!open)
    setShowModal(!open)
    reset()
    setEditData(null)
  }

  const handleClose = (from = null) => {
    handleModal()
  }

  const handleSave = (form) => {
    log(form)
    if (isValid(form?.question)) {
      addQuestion({
        jsonData: {
          ...form
        },
        loading: setLoading,
        dispatch,
        success: (d) => {
          onSuccess(d?.payload, 'saved')
          handleClose()
        }
      })
    } else {
      const r = []
      if (isValidArray(form?.selected_questions)) {
        form?.selected_questions?.forEach((q, i) => {
          r.push(questions?.find((a) => a.id === q))
        })
      }
      onSuccess(r, 'selected')
      handleClose()
    }
  }
  return (
    <>
      {!noView ? (
        <Component role='button' onClick={handleModal} {...rest}>
          {children}
        </Component>
      ) : null}
      <CenteredModal
        disableFooter={view === null}
        title={FM('complete-followups')}
        scrollControl={scrollControl}
        disableSave={loadingDetails}
        loading={loading}
        modalClass={'modal-md'}
        open={open}
        done='add'
        handleModal={handleClose}
        handleSave={handleSubmit(handleSave)}
      >
        <div className='p-2' style={{ minHeight: 400 }}>
          <Show IF={view === null}>
            <Row className='justify-content-center align-items-center'>
              <Col md='12' className='mt-2 justify-content-center align-items-center d-flex'>
                <Button.Ripple
                  onClick={() => {
                    setView(1)
                  }}
                  className=''
                  color='primary'
                  outline
                >
                  {FM('select-question')}
                </Button.Ripple>
              </Col>
              <Col md='12' className='mt-2 mb-2 justify-content-center align-items-center d-flex'>
                <Button.Ripple
                  onClick={() => {
                    setView(2)
                  }}
                  color='primary'
                >
                  {FM('create-question')}
                </Button.Ripple>
              </Col>
            </Row>
          </Show>
          <Show IF={view === 1}>
            <Row>
              <Col md='12'>
                <Button.Ripple
                  onClick={() => {
                    setView(null)
                  }}
                  color='primary'
                  size='sm'
                  className='mb-2'
                  outline
                >
                  {FM('back')}
                </Button.Ripple>
              </Col>
              <Col md='12'>
                <FormGroupCustom
                  type={'select'}
                  control={control}
                  errors={errors}
                  isMulti
                  name={'selected_questions'}
                  isClearable
                  grouped
                  options={selectQuestion}
                  feedback={FM('select-question')}
                  label={FM('select-question')}
                  rules={{ required: false }}
                  className='mb-1 '
                />
              </Col>
            </Row>
          </Show>
          <Show IF={view === 2}>
            <Row>
              <Col md='12'>
                <Button.Ripple
                  onClick={() => {
                    setView(null)
                  }}
                  color='primary'
                  size='sm'
                  className='mb-2'
                  outline
                >
                  {FM('back')}
                </Button.Ripple>
              </Col>
              <Col md='12'>
                <FormGroupCustom
                  value={edit?.group_name}
                  placeholder={FM('group-name')}
                  type='text'
                  name='group_name'
                  label={FM('group-name')}
                  className='mb-1'
                  // errors={errors}
                  control={control}
                  rules={{ required: true }}
                />
                <FormGroupCustom
                  placeholder={FM('question')}
                  type='text'
                  name='question'
                  label={FM('question')}
                  className='mb-1'
                  // errors={errors}
                  control={control}
                  value={edit?.question}
                  rules={{ required: true }}
                />

                <FormGroupCustom
                  value={1}
                  noGroup
                  noLabel
                  type={'hidden'}
                  name='is_visible'
                  label={FM('enable')}
                  errors={errors}
                  control={control}
                  rules={{ required: false }}
                />
              </Col>
            </Row>
          </Show>
        </div>
      </CenteredModal>
    </>
  )
}

export default QuestionModal
