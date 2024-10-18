import classNames from 'classnames'
import React, { useEffect, useState } from 'react'
import { Plus } from 'react-feather'
import { Card, Col, InputGroupText, Row } from 'reactstrap'
import { loadUser } from '../../../../utility/apis/userManagement'
import { UserTypes } from '../../../../utility/Const'
import { FM, isValid, isValidArray, log } from '../../../../utility/helpers/common'
import { Permissions } from '../../../../utility/Permissions'
import Show from '../../../../utility/Show'
import { createAsyncSelectOptions, createSelectOptions } from '../../../../utility/Utils'
import FormGroupCustom from '../../../components/formGroupCustom'
import BsTooltip from '../../../components/tooltip'
import UserModal from '../../../userManagement/fragment/UserModal'

const Customer = ({
  open = false,
  setDisplay = () => {},
  ipRes = null,
  currentIndex = null,
  loadingDetails = false,
  requiredEnabled,
  watch,
  setValue,
  edit,
  onSubmit,
  control,
  errors
}) => {
  const [weekDaysSelected, setWeekDaysSelected] = useState([])
  const [time, setTime] = useState(null)
  const [end, setEnd] = useState(null)
  //category
  const [category, setCategory] = useState([])
  const [categoryLoad, setCategoryLoad] = useState(false)
  //subCategory
  const [subCategory, setSubCategory] = useState([])
  const [subLoad, setSubLoad] = useState(false)
  /////ip
  const [ip, setIp] = useState([])
  const [ipLoad, setIpLoad] = useState(false)
  //patient
  const [patient, setPatient] = useState([])
  const [paientLoad, setPatientLoad] = useState(false)
  //emp_id
  const [emp, setEmp] = useState([])
  const [empLoad, setEmpLoad] = useState(false)
  //branch
  const [branch, setBranch] = useState([])
  const [branchLoading, setBranchLoading] = useState(false)

  const [selectedPatient, setSelectedPatient] = useState(null)
  const [selectedIp, setSelectedIp] = useState(null)

  const [selectedCategory, setSelectedCategory] = useState(null)
  const [selectedSubCat, setSelectedSubCat] = useState(null)

  //branch options
  const loadBranchOptions = async (search = null, loadedOptions, { page }) => {
    const res = await loadUser({
      async: true,
      page,
      perPage: 100,
      jsonData: { user_type_id: UserTypes.branch }
    })
    return createAsyncSelectOptions(res, page, 'branch_name', 'id', setBranch)
  }

  const loadPatientOption = async (search, loadedOptions, { page }) => {
    const res = await loadUser({
      async: true,
      page,
      perPage: 100,
      jsonData: { name: search, user_type_id: UserTypes.patient }
    })
    return createAsyncSelectOptions(res, page, 'name', 'id', setPatient)
  }

  const handleNewPatient = (e) => {
    log('eeeee, e', e)
    loadPatientOption()
    setSelectedPatient({
      label: e?.name,
      value: e?.id
    })
    setValue('patient_id', e?.id)
  }

  const getIpCategory = () => {
    const ipId = watch('ip_id')
    log('ipId', ipId)
    if (isValid(ipId)) {
      log('valid')
      const ipDetails = ip?.find((a) => a?.value?.id === ipId)
      log(ipDetails)

      if (typeof ipDetails === 'object') {
        log(ipDetails)
      }
    }
  }
  const handleNewIp = (e, f = false) => {
    log('eeeee, e', e)
    if (f) {
      setSelectedIp({
        label: e?.payload[0]?.title,
        value: e?.payload[0]?.id
      })
      setValue('ip_id', e?.payload[0]?.id)
    } else {
      setSelectedIp({
        label: e?.title,
        value: e?.id
      })
      setValue('ip_id', e?.id)
    }
  }

  useEffect(() => {
    getIpCategory()
  }, [ip])

  useEffect(() => {
    if (isValidArray(ipRes)) {
      setIp(createSelectOptions(ipRes, 'title', null))
    }
  }, [ipRes])

  useEffect(() => {
    if (open) {
      if (isValid(ipRes) && isValidArray(ipRes)) {
        handleNewIp(ipRes[0])
        handleNewPatient(ipRes[0]?.patient)
      }
    }
  }, [ipRes, open])

  useEffect(() => {
    getIpCategory()
  }, [watch('ip_id')])

  useEffect(() => {
    if (edit !== null) {
      setValue('ip_id', edit?.ip_id)
      setValue('patient_id', edit?.patient_id)
    }
  }, [edit])

  return (
    <>
      <div className='p-2'>
        <Card className='p-2 mb-2 shadow rounded'>
          <div className='content-header mb-2'>
            <h5 className='mb-0'>{FM('patient-date')}</h5>
            <small className='text-muted'>{FM('enter-details')}</small>
          </div>
          <Row>
            {/* <Col md="6">
                            <FormGroupCustom
                                type={"select"}
                                control={control}
                                errors={errors}
                                name={"branch_id"}
                                defaultOptions
                                async
                                cacheOptions
                                loadOptions={loadBranchOptions}
                                value={edit?.branch_id}
                                options={branch}
                                label={FM("branch")}
                                rules={{ required: true }}
                                noLabel={branch.length === 0}
                                className={classNames('mb-1 ', { 'd-block': branch.length > 0, 'd-none': branch.length === 0 })}
                            />
                        </Col> */}
            <Col md='6'>
              <FormGroupCustom
                key={`pp-${selectedPatient?.value}`}
                append={
                  ipRes === null && edit === null ? (
                    <Show IF={Permissions.patientsAdd}>
                      {' '}
                      <BsTooltip title={FM('add-new')} Tag={InputGroupText}>
                        <UserModal
                          Component={Plus}
                          size={18}
                          enableSaveIp={false}
                          onSuccess={handleNewPatient}
                          userType={UserTypes.patient}
                          scrollControl={false}
                          handleToggle={(e) => {
                            if (e) {
                              setDisplay(false)
                            } else {
                              setDisplay(true)
                            }
                          }}
                        />
                      </BsTooltip>{' '}
                    </Show>
                  ) : null
                }
                type={'select'}
                control={control}
                errors={errors}
                name={'patient_id'}
                defaultOptions
                async
                cacheOptions
                loadOptions={loadPatientOption}
                value={selectedPatient?.value ?? edit?.patient_id}
                options={patient}
                label={FM('patient')}
                rules={{ required: false }}
                placeholder={edit !== null || ipRes !== null ? FM('loading') : FM('select')}
                className='mb-1'
              />
            </Col>
            <Col md='6'>
              <FormGroupCustom
                name={'date_time'}
                type={'date'}
                errors={errors}
                label={FM('date-time')}
                options={{
                  enableTime: true,
                  maxDate: new Date()
                }}
                dateFormat={'YYYY-MM-DD HH:mm'}
                setValue={setValue}
                className='mb-2'
                control={control}
                rules={{ required: requiredEnabled ? currentIndex === 0 : false }}
                values={edit}
              />
            </Col>
          </Row>
        </Card>
      </div>
    </>
  )
}

export default Customer
