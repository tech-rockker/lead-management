import classNames from 'classnames'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import { Col, Form, Row } from 'reactstrap'
import { FM } from '../../../src/utility/helpers/common'
import {
  createAsyncSelectOptions,
  decryptObject,
  Status,
  StatusWithoutNotDone
} from '../../../src/utility/Utils'
import { categoriesLoad, categoryChildList } from '../../utility/apis/categories'

import { loadPatientPlanList } from '../../utility/apis/ip'
import { loadUser } from '../../utility/apis/userManagement'
import { forDecryption, UserTypes } from '../../utility/Const'
import Hide from '../../utility/Hide'
import useModules from '../../utility/hooks/useModules'
import useUserType from '../../utility/hooks/useUserType'
import Show from '../../utility/Show'
import FormGroupCustom from '../../views/components/formGroupCustom'
// import Select from '../components/select'
import SideModal from '../../views/components/sideModal/sideModal'

const ActivityFilter = ({
  hideDates = false,
  show,
  handleFilterModal,
  setFilterData,
  filterData
}) => {
  const dispatch = useDispatch()
  const form = useForm()
  const {
    formState: { errors },
    handleSubmit,
    control,
    reset,
    setValue,
    watch,
    getValues
  } = form
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(show)
  const { ViewActivity, ViewDeviation, ViewJournal, ViewSchedule } = useModules()
  const [companyData, setCompanyData] = useState(null)
  //activity cls
  const [_class, setClass] = useState([])
  /////ip
  const [ip, setIp] = useState([])
  //category
  const [category, setCategory] = useState([])
  //Branch
  const [branch, setBranch] = useState([])
  //patient
  const [patient, setPatient] = useState([])
  const [subCategory, setSubCategory] = useState([])
  const userType = useUserType()

  const loadCategoryData = async (search, loadedOptions, { page }) => {
    const res = await categoriesLoad({
      async: true,
      page,
      perPage: 100,
      jsonData: { name: search }
    })
    return createAsyncSelectOptions(res, page, 'name', 'id', setCategory)
  }

  const loadCatOptions = async (search, loadedOptions, { page }) => {
    if (watch('category_id')) {
      const res = await categoryChildList({
        async: true,
        page,
        perPage: 100,
        jsonData: { name: search, parent_id: watch('category_id') }
      })
      return createAsyncSelectOptions(res, page, 'name', 'id', setSubCategory)
    } else {
      return {
        options: [],
        hasMore: false
      }
    }
  }

  const loadIpOption = async (search, loadedOptions, { page }) => {
    const res = await loadPatientPlanList({
      async: true,
      page,
      perPage: 100,
      jsonData: { name: search }
    })
    return createAsyncSelectOptions(res, page, 'title', 'id', setIp)
  }

  const loadBranchOptions = async (search, loadedOptions, { page }) => {
    const res = await loadUser({
      async: true,
      page,
      perPage: 100,
      jsonData: { name: search, user_type_id: 11 }
    })
    return createAsyncSelectOptions(res, page, 'branch_name', 'id', setBranch, (x) => {
      return decryptObject(forDecryption, x)
    })
  }

  const loadPatientOption = async (search, loadedOptions, { page }) => {
    const res = await loadUser({
      async: true,
      page,
      perPage: 100,
      jsonData: { name: search, user_type_id: UserTypes.patient }
    })
    return createAsyncSelectOptions(res, page, 'name', 'id', setPatient, (x) => {
      return decryptObject(forDecryption, x)
    })
  }

  const submitFilter = (d) => {
    setFilterData(d)
    setOpen(false)
    handleFilterModal(false)
  }

  // Show/Hide Modal
  useEffect(() => {
    if (show) setOpen(true)
    if (!show) reset()
  }, [show])

  const required = () => {
    if (watch('with_deviation') === 1) {
      return false
    } else if (watch('with_journal') === 1) {
      return false
    }
    return true
  }

  return (
    <SideModal
      loading={loading}
      handleSave={handleSubmit(submitFilter)}
      open={open}
      handleModal={() => {
        setOpen(false)
        handleFilterModal(false)
      }}
      title={'activity-filter'}
      done='filter'
    >
      <Form>
        <FormGroupCustom
          label={FM('status')}
          type={'select'}
          isClearable
          // defaultOptions
          control={control}
          options={userType !== UserTypes.patient ? Status() : StatusWithoutNotDone()}
          name={'status'}
          rules={
            {
              // required: required()
            }
          }
          className='mb-2'
        />

        <Row>
          <Show IF={ViewJournal}>
            <Col md='6'>
              <FormGroupCustom
                label={'journals'}
                name={'with_journal'}
                type={'checkbox'}
                value={watch('with_journal')}
                errors={errors}
                control={control}
                className='mb-1 '
              />
            </Col>
          </Show>
          <Show IF={ViewDeviation}>
            <Col md='6'>
              <FormGroupCustom
                label={'deviation'}
                name={'with_deviation'}
                type={'checkbox'}
                value={watch('with_deviation')}
                errors={errors}
                control={control}
                className='mb-1 '
              />
            </Col>
          </Show>
        </Row>
        <Hide IF={userType === UserTypes.patient}>
          <FormGroupCustom
            type={'select'}
            isClearable
            async
            // defaultOptions
            loadOptions={loadCategoryData}
            control={control}
            options={category}
            errors={errors}
            rules={{ required: false }}
            name='category_id'
            className='mb-1'
            label={FM('category')}
          />
          <FormGroupCustom
            type={'select'}
            key={watch('category_id')}
            async
            // defaultOptions
            loadOptions={loadCatOptions}
            control={control}
            options={subCategory}
            errors={errors}
            rules={{ required: false }}
            name='subcategory_id'
            className='mb-1'
            label={FM('sub-category')}
          />
        </Hide>
        <FormGroupCustom
          label={'branch'}
          type={'select'}
          async
          isClearable
          // defaultOptions
          control={control}
          options={branch}
          loadOptions={loadBranchOptions}
          name={'branch_id'}
          noLabel={branch.length === 0}
          className={classNames('mb-1 ', {
            'd-block': branch.length > 0,
            'd-none': branch.length === 0
          })}
        />

        <FormGroupCustom
          label={'patient'}
          type={'select'}
          async
          isClearable
          // defaultOptions
          control={control}
          options={patient}
          loadOptions={loadPatientOption}
          name={'patient_id'}
          className='mb-2'
        />

        {/* <FormGroupCustom
                    label={"employess"}
                    type={"select"}
                    async
                    isClearable
                    // defaultOptions
                    control={control}
                    options={employee}
                    loadOptions={loadEmployeeOption}
                    name={"employee_id"}
                    className="mb-2"
                /> */}

        <FormGroupCustom
          label={'implementations'}
          type={'select'}
          async
          isClearable
          // defaultOptions
          control={control}
          options={ip}
          loadOptions={loadIpOption}
          name={'ip_id'}
          className='mb-2'
        />
        {/* <FormGroupCustom
                    label={"journal"}
                    type={"select"}
                    isClearable
                    // defaultOptions
                    control={control}
                    options={activityWithJournal()}
                    name={"with_journal"}
                    className="mb-1"
                    rules={{ required: false }}
                />
                <FormGroupCustom
                    label={"deviation"}
                    type={"select"}
                    isClearable
                    // defaultOptions
                    control={control}
                    options={activityWithDeviation()}
                    name={"with_deviation"}
                    className="mb-1"
                    rules={{ required: false }}
                /> */}

        {/* <Row>
                    <Col md="6">
                        <FormGroupCustom
                            label={"journal"}
                            name={"option"}
                            type={"checkbox"}
                            errors={errors}
                            className="mb-2"
                            control={control}
                        />
                    </Col>
                    <Col md="6">
                        <FormGroupCustom
                            label={"deviation"}
                            name={"option"}
                            type={"checkbox"}
                            errors={errors}
                            className="mb-2"
                            control={control}
                        />
                    </Col>
                </Row> */}

        <FormGroupCustom
          placeholder={FM('title')}
          type='text'
          name='title'
          label={FM('title')}
          className='mb-1'
          control={control}
          rules={{ required: false }}
        />
        <Hide IF={hideDates === true}>
          <FormGroupCustom
            name={'start_date'}
            type={'date'}
            setValue={setValue}
            errors={errors}
            label={FM('start-date')}
            className='mb-2'
            control={control}
            rules={{ required: false }}
          />
          <FormGroupCustom
            name={'end_date'}
            type={'date'}
            errors={errors}
            setValue={setValue}
            label={FM('end-date')}
            options={{
              minDate: new Date(watch('start_date'))
            }}
            className='mb-2'
            control={control}
            rules={{ required: false }}
          />
        </Hide>
      </Form>
    </SideModal>
  )
}

export default ActivityFilter
