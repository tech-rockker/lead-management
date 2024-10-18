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
import { getModuleList, loadModule } from '../../../../utility/apis/moduleApis'
import { FM, isValid } from '../../../../utility/helpers/common'
import Hide from '../../../../utility/Hide'
import { createAsyncSelectOptions, createSelectOptions } from '../../../../utility/Utils'
import FormGroupCustom from '../../../components/formGroupCustom'

const ApproveForm = ({
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

  const [module, setModule] = useState([])
  const [loading, setLoading] = useState(false)

  const loadModuleOptions = () => {
    getModuleList({
      page: 1,
      perPage: 100,
      success: (e) => {
        setModule(createSelectOptions(e?.payload?.data, 'name', 'id'))
      }
    })
  }

  useEffect(() => {
    loadModuleOptions()
  }, [])

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
                  key={`fcdbdsfgsgfs-${edit?.template_id}`}
                  defaultOptions
                  value={edit?.id}
                  control={control}
                  // rules={{ required: true }}
                  // errors={errors}
                  isMulti
                  //  onChange={multiSelectHandle}
                  /////
                  type={'select'}
                  errors={errors}
                  name={'modules'}
                  isClearable
                  //matchWith="id"
                  cacheOptions
                  loadOptions={loadModuleOptions}
                  options={module}
                  label={FM('Modules')}
                  rules={{ required: false }}
                  className='mb-1'
                />
              </Col>
              <Col md='12'>
                <FormGroupCustom
                  name={'request_comment'}
                  type={'textarea'}
                  errors={errors}
                  placeholder={FM('comment')}
                  label={FM('comment')}
                  className='mb-1'
                  control={control}
                  setValue={setValue}
                  rules={{ required: false }}
                  value={edit?.title}
                />
              </Col>
            </Row>
          </Col>
        </Row>
        <Row></Row>
      </CardBody>
    </div>
  )
}

export default ApproveForm
