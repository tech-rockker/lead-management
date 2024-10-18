import classNames from 'classnames'
import React from 'react'
import { Col, Row } from 'reactstrap'
import { overallGoals } from '../../../../../utility/Const'
import { createConstSelectOptions } from '../../../../../utility/Utils'
import { FM, isValid } from '../../../../../utility/helpers/common'
import FormGroupCustom from '../../../../components/formGroupCustom'

const Step5 = ({
  path = 3,
  handleStepBg = () => {},
  createFor = null,
  setDisplay = () => {},
  loadingDetails = false,
  requiredEnabled,
  watch,
  setValue,
  edit,
  onSubmit,
  control,
  errors
}) => {
  return (
    <div className='p-2 w-100'>
      <div className='content-header p-0 mb-2'>
        <h5 className='mb-0'>{FM('overall-goal')}</h5>
        <small className='text-muted'>{FM('write-goal-or-choose')}</small>
      </div>
      <FormGroupCustom
        type={'hidden'}
        noGroup
        noLabel
        control={control}
        errors={errors}
        value=''
        setValue={setValue}
        rules={{ required: false }}
        name={`overall_goal`}
        className='mb-2'
      />
      <Row>
        {createConstSelectOptions(overallGoals, FM)?.map((d, x) => {
          return (
            <Col md='4'>
              <FormGroupCustom
                type={'radio'}
                key={`${d?.value}-${edit?.overall_goal}-${watch('overall_goal')}`}
                control={control}
                errors={errors}
                defaultChecked={watch(`overall_goal`) === d?.value}
                setValue={setValue}
                rules={{ required: false }}
                value={d?.value}
                name={`overall_goal`}
                className='mb-2'
                label={d?.label}
              />
            </Col>
          )
        })}
        <Col md='12' className={classNames({ 'd-none': !isValid(watch(`overall_goal`)) })}>
          <FormGroupCustom
            style={{ minHeight: 130 }}
            key={`title-${edit?.overall_goal_details}`}
            label={`${FM(watch(`overall_goal`))}: ${FM('overall-goal-details')}`}
            name={`overall_goal_details`}
            value={edit?.overall_goal_details}
            type={'autocomplete'}
            errors={errors}
            className='mb-2'
            control={control}
            rules={{ required: false }}
          />
        </Col>
      </Row>
    </div>
  )
}

export default Step5
