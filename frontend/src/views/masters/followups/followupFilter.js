import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { Form } from 'reactstrap'
import { loadPatientPlanList } from '../../../utility/apis/ip'
import { loadUser } from '../../../utility/apis/userManagement'
import { FM } from '../../../utility/helpers/common'
import Hide from '../../../utility/Hide'
import { createAsyncSelectOptions, followupStatus, Status } from '../../../utility/Utils'
import FormGroupCustom from '../../components/formGroupCustom'
// import Select from '../components/select'
import SideModal from '../../components/sideModal/sideModal'

const FollowupFilter = ({
  hideDates = false,
  show,
  handleFilterModal,
  setFilterData,
  filterData
}) => {
  // Dispatch
  const dispatch = useDispatch()
  // Form Validation
  const {
    register,
    formState: { errors },
    handleSubmit,
    control,
    getValues,
    watch,
    reset
  } = useForm()
  const history = useHistory()
  // States
  const [open, setOpen] = useState(show)
  const [cats, setCats] = useState([])
  const [loading, setLoading] = useState(false)
  const [ip, setIp] = useState([])
  const [user, setUser] = useState([])

  // const submitFilter = (d) => {
  //     setFilterData(d)
  //     console.log(d)
  // }
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

  const loadIpOption = async (search, loadedOptions, { page }) => {
    const res = await loadPatientPlanList({
      async: true,
      page,
      perPage: 100,
      jsonData: { name: search }
    })
    return createAsyncSelectOptions(res, page, 'title', 'id', setIp)
  }

  const loadUserTypeOptions = async (search, loadedOptions, { page }) => {
    const res = await loadUser({
      async: true,
      page,
      perPage: 100,
      jsonData: { user_type_id: 6 }
    })
    return createAsyncSelectOptions(res, page, 'name', 'id', setUser)
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
      title={'followup-filter'}
      done='filter'
    >
      <Form>
        <FormGroupCustom
          label={FM('ip-plans')}
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
            type='date'
            name='start_date'
            label={FM('start-date')}
            className='mb-1'
            control={control}
            dateFormat={false}
            S
            rules={{ required: false }}
          />

          <FormGroupCustom
            type='date'
            name='end_date'
            label={FM('end-date')}
            className='mb-1'
            options={{
              minDate: new Date(watch('start_date'))
            }}
            dateFormat={false}
            control={control}
            rules={{ required: false }}
          />
        </Hide>
        <FormGroupCustom
          label={FM('status')}
          type={'select'}
          isClearable
          // defaultOptions
          control={control}
          options={followupStatus()}
          name={'is_completed'}
          className='mb-12'
        />
      </Form>
    </SideModal>
  )
}

export default FollowupFilter
