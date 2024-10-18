// ** React Imports
import { Fragment, useEffect, useState } from 'react'
// ** Reactstrap Imports
import { Alert, Col, Form, Row } from 'reactstrap'
import { loadGroupQuestions } from '../../../../../utility/apis/commons'
import { FM } from '../../../../../utility/helpers/common'
import { toggleArray } from '../../../../../utility/Utils'
import FormGroupCustom from '../../../../components/formGroupCustom'
import Shimmer from '../../../../components/shimmers/Shimmer'

const GroupQuestions = ({
  showAlert = false,
  requiredEnabled,
  watch,
  setValue,
  edit,
  onSubmit,
  control,
  errors
}) => {
  const [questions, setQuestions] = useState([])
  const [questionsSelected, setQuestionsSelected] = useState([])
  const [loading, setLoading] = useState(null)

  const loadQuestions = () => {
    loadGroupQuestions({
      loading: setLoading,
      success: (e) => {
        setQuestions(e?.payload)
      }
    })
  }

  useEffect(() => {
    loadQuestions()
  }, [])

  useEffect(() => {
    if (edit !== null) {
      setQuestionsSelected(edit?.questions?.map((q) => q?.question_id))
    }
  }, [edit])

  // const handleQuestionToggle = (checked, groupIndex, questionIndex) => {
  //     const g = questions[groupIndex]
  //     const q = g?.questions
  //     const qs = q[questionIndex]
  //     const finalQs = { ...qs, is_visible: checked ? 1 : 0 }
  //     questions[groupIndex].questions[questionIndex] = finalQs
  //     setQuestions([...questions])
  // }

  useEffect(() => {
    setValue('questions', questionsSelected)
  }, [questionsSelected])

  return (
    <Fragment>
      <Alert color='danger' isOpen={showAlert} className='p-1'>
        {FM('please-select-question')}
      </Alert>
      <Form onSubmit={onSubmit}>
        <FormGroupCustom
          noGroup
          noLabel
          type={'hidden'}
          control={control}
          errors={errors}
          name={'questions'}
          className='d-none'
          value={questionsSelected}
          rules={{ required: false }}
        />
        {loading ? (
          <>
            <Shimmer style={{ height: 25, marginBottom: 4, borderRadius: 2 }} />
            <Shimmer style={{ height: 20, width: '90%', marginBottom: 4, borderRadius: 2 }} />
            <Shimmer style={{ height: 20, width: '50%', marginBottom: 25, borderRadius: 2 }} />

            <Shimmer style={{ height: 25, marginBottom: 4, borderRadius: 2 }} />
            <Shimmer style={{ height: 20, width: '90%', marginBottom: 4, borderRadius: 2 }} />
            <Shimmer style={{ height: 20, width: '50%', marginBottom: 25, borderRadius: 2 }} />

            <Shimmer style={{ height: 25, marginBottom: 4, borderRadius: 2 }} />
            <Shimmer style={{ height: 20, width: '90%', marginBottom: 4, borderRadius: 2 }} />
            <Shimmer style={{ height: 20, width: '50%', marginBottom: 25, borderRadius: 2 }} />

            <Shimmer style={{ height: 25, marginBottom: 4, borderRadius: 2 }} />
            <Shimmer style={{ height: 20, width: '90%', marginBottom: 4, borderRadius: 2 }} />
            <Shimmer style={{ height: 20, width: '50%', marginBottom: 25, borderRadius: 2 }} />
          </>
        ) : (
          questions?.map((group, i) => {
            return (
              <Row>
                <div className='content-header'>
                  <h5>{group?.group_name}</h5>
                  <p className='mb-2'>
                    <small>{FM('please-select-some-question')}</small>
                  </p>
                  {group?.questions?.map((q, j) => {
                    return (
                      <Col md='12' xs='12'>
                        <FormGroupCustom
                          key={`${questionsSelected?.length}q`}
                          value={questionsSelected?.includes(q?.id) ? 1 : 0}
                          type='checkbox'
                          name='questions'
                          label={q?.question}
                          classNameLabel={'w-100'}
                          className='mb-1'
                          onChangeValue={(e) =>
                            toggleArray(q?.id, questionsSelected, setQuestionsSelected)
                          }
                          errors={errors}
                          control={control}
                          rules={{ required: false }}
                        />
                      </Col>
                    )
                  })}
                </div>
              </Row>
            )
          })
        )}
      </Form>
    </Fragment>
  )
}

export default GroupQuestions
