import React, { useEffect, useState } from 'react'
import { AccordionBody, AccordionHeader, AccordionItem, UncontrolledAccordion } from 'reactstrap'
import { FM } from '../../../../utility/helpers/common'
import { isValidArray } from './../../../../utility/helpers/common'

const QuestionsTab = ({ followup }) => {
  const [questions, setQuestions] = useState([])

  useEffect(() => {
    const q = isValidArray(followup?.questions) ? followup?.questions : []
    setQuestions(q)
  }, [followup])

  const renderQuestions = () => {
    const re = []
    if (questions?.length > 0) {
      questions?.forEach((group, index) => {
        re.push(
          <div className='mb-2'>
            <p className='text-uppercase mb-0 text-dark fw-bolder h5'>
              {index + 1}: {group?.question}
            </p>
            <p className='mb-0 fw-bold text-secondary mt-3px'>{group?.answer}</p>
          </div>
        )
      })
    } else {
      re.push(<div className='text-center fw-bold'>{FM('no-questions-yet')}</div>)
    }
    return <>{re}</>
  }
  return <div className='p-2 border-top'>{renderQuestions()}</div>
}

export default QuestionsTab
