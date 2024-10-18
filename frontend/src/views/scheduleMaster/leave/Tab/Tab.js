import React, { useEffect, useState } from 'react'
import { Calendar, User } from 'react-feather'
import { useForm } from 'react-hook-form'
import { Nav, NavItem, NavLink, TabContent, TabPane } from 'reactstrap'
import { FM } from '../../../../utility/helpers/common'
import Show from '../../../../utility/Show'
import FormGroupCustom from '../../../components/formGroupCustom'
import LeaveDetail from '../LeaveDetail'
import MultiLeave from '../MultiLeave'

const Tab = ({
  loadScheduleArr = () => {},
  scArr = [],
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
  const [actionData, setActionData] = useState(null)
  const [loadingDetails, setLoadingDetails] = useState(false)
  // const {
  //     control,
  //     handleSubmit,
  //     formState: { errors },
  //     reset,
  //     setValue,
  //     watch,
  //     getValues,
  //     setError
  // } = useForm()

  useEffect(() => {
    setValue('is_repeat', active === '1' ? 0 : 1)
  }, [active])

  return (
    <div className='white p-25 shadow p-2'>
      <FormGroupCustom
        noLabel
        noGroup
        value={edit?.is_repeat}
        type='hidden'
        name='is_repeat'
        control={control}
      />
      <Nav pills className='mb-2  flex-column flex-sm-row'>
        <NavItem>
          <NavLink active={active === '1'} onClick={() => toggleTab('1')}>
            <Calendar className='font-medium-3 me-50' />
            <span className='fw-bold'> {FM('random-date')} </span>
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink active={active === '2'} onClick={() => toggleTab('2')}>
            <Calendar className='font-medium-3 me-50' />
            <span className='fw-bold'> {FM('multiple-date')} </span>
          </NavLink>
        </NavItem>
      </Nav>
      <TabContent activeTab={active}>
        <TabPane tabId='1'>
          <LeaveDetail
            loadScheduleArr={loadScheduleArr}
            scArr={scArr}
            active={active}
            leave={leave}
            getValues={getValues}
            setError={setError}
            loadingDetails={loadingDetails}
            onSubmit={onSubmit}
            requiredEnabled={requiredEnabled}
            watch={watch}
            setValue={setValue}
            control={control}
            errors={errors}
          />
        </TabPane>
        <TabPane tabId='2'>
          <MultiLeave
            scArr={scArr}
            active={active}
            leave={leave}
            getValues={getValues}
            setError={setError}
            loadingDetails={loadingDetails}
            onSubmit={onSubmit}
            requiredEnabled={requiredEnabled}
            watch={watch}
            setValue={setValue}
            control={control}
            errors={errors}
          />
        </TabPane>
        {/* <TabPane tabId='3'>
            <JournalEmployee data={data} />
        </TabPane> */}
      </TabContent>
    </div>
  )
}

export default Tab
