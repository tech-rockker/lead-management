import React, { useEffect, useState } from 'react'
import { Calendar, User } from 'react-feather'

import {
  Card,
  CardBody,
  Col,
  Nav,
  NavItem,
  NavLink,
  Row,
  TabContent,
  TabPane,
  CardHeader,
  CardText,
  InputGroupText,
  Label
} from 'reactstrap'
import FormGroupCustom from '../../../../components/formGroupCustom'
import { FM, isValid, isValidArray, log } from '../../../../../utility/helpers/common'

import { loadWorkShift } from '../../../../../utility/apis/companyWorkShift'
import {
  addDay,
  calculateTime,
  createAsyncSelectOptions,
  createConstSelectOptions,
  enableFutureDates,
  formatDate,
  WarningToast
} from '../../../../../utility/Utils'
import { loadScTemplate } from '../../../../../utility/apis/scheduleTemplate'
import Hide from '../../../../../utility/Hide'

const ScheduleTemplateForm = ({
  ips = null,
  useFieldArray = () => {},
  leave = null,
  editIpRes = null,
  ipRes = null,
  reLabel = null,
  getValues = () => {},
  requiredEnabled,
  watch,
  setValue,
  edit,
  onSubmit = () => {},
  control,
  errors,
  setError
}) => {
  const [active, setActive] = useState('1')

  const toggleTab = (tab) => {
    if (active !== tab) {
      setActive(tab)
    }
  }
  const [id, setId] = useState(null)

  const [template, setTemplate] = useState([])

  const loadTemplateOptions = async (search, loadedOptions, { page }) => {
    const res = await loadScTemplate({
      async: true,
      page,
      perPage: 100,
      jsonData: { name: search }
    })

    return createAsyncSelectOptions(res, page, 'title', 'id', setTemplate)
  }

  return (
    <div className='p-0 m-0'>
      <FormGroupCustom
        noLabel
        noGroup
        value={edit?.is_repeat}
        type='hidden'
        name='is_repeat'
        control={control}
      />
      <CardBody>
        {/* {JSON.stringify(groupEnabled)} */}
        <Row className='mb-1'>
          <Col md='12'>
            <Row>
              <Col md='12'>
                <FormGroupCustom
                  name={'title'}
                  type={'text'}
                  errors={errors}
                  placeholder={FM('template-title')}
                  label={FM('title')}
                  className='mb-1'
                  control={control}
                  setValue={setValue}
                  key={edit?.title}
                  rules={{ required: false }}
                  value={edit?.title}
                />
              </Col>
              <Hide IF={isValid(edit?.id)}>
                <Col md='12'>
                  <FormGroupCustom
                    key={`fcdbdsfgsgfs-${edit?.template_id}`}
                    async
                    defaultOptions
                    value={edit?.id}
                    control={control}
                    // rules={{ required: true }}
                    // errors={errors}
                    //isMulti
                    //  onChange={multiSelectHandle}
                    /////
                    type={'select'}
                    errors={errors}
                    name={'template_id'}
                    isClearable
                    //matchWith="id"
                    cacheOptions
                    loadOptions={loadTemplateOptions}
                    options={template}
                    label={FM('copy-from')}
                    rules={{ required: false }}
                    className='mb-1'
                  />
                </Col>
              </Hide>
              <Hide IF={!isValid(watch('template_id'))}>
                <Col md='6'>
                  <FormGroupCustom
                    setValue={setValue}
                    control={control}
                    type={'date'}
                    errors={errors}
                    name={'start_date'}
                    label={FM('start-date')}
                    rules={{ required: true }}
                    className='mb-1'
                  />
                </Col>
                <Col md='6'>
                  <FormGroupCustom
                    control={control}
                    type={'date'}
                    setValue={setValue}
                    errors={errors}
                    name={'end_date'}
                    label={FM('end-date')}
                    rules={{ required: true }}
                    className='mb-1'
                  />
                </Col>
              </Hide>
            </Row>
          </Col>
        </Row>
        <Row></Row>
      </CardBody>
    </div>
  )
}

export default ScheduleTemplateForm
