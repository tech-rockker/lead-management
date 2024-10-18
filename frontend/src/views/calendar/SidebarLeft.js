// ** React Imports
import { Fragment, useEffect } from 'react'

// ** Custom Components
import classnames from 'classnames'

// ** Reactstrap Imports
import { CardBody, Button, Input, Label } from 'reactstrap'
import { useForm } from 'react-hook-form'
// ** illustration import
import illustration from '@src/assets/images/pages/calendar-illustration.png'
import { FM, log } from '../../utility/helpers/common'
import FormGroupCustom from '../components/formGroupCustom'
import { createConstSelectOptions, createSelectOptions } from '../../utility/Utils'
import { status } from '../../utility/Const'
import ActivityModal from '../activity/fragment/activityModal'

// ** Filters Checkbox Array
const filters = [
  { value: 3, label: 'notApplicable', color: 'danger', className: 'form-check-danger mb-1' },
  // { label: 'Activity', color: 'primary', className: 'form-check-primary mb-1' },
  { value: 2, label: 'pending', color: 'warning', className: 'form-check-warning mb-1' },
  { value: 1, label: 'done', color: 'success', className: 'form-check-success mb-1' },
  { value: 0, label: 'upcoming', color: 'info', className: 'form-check-info' }
]

//    { value: 'Activity', label: 'Activity', color: 'primary' },
// { value: 'Implementation', label: 'Implementation', color: 'danger' },
// { value: 'Followups', label: 'Followups', color: 'warning' },
// { value: 'Employee', label: 'Employee', color: 'success' },
// { value: 'Patient', label: 'Patient', color: 'info' }

const SidebarLeft = (props) => {
  // ** Props
  const {
    formState: { errors },
    handleSubmit,
    control,
    reset,
    watch,
    setValue,
    getValues
  } = useForm()
  const {
    handleAddEventSidebar,
    toggleSidebar,
    updateFilter,
    updateAllFilters,
    store,
    dispatch = () => {},
    filterData
  } = props

  // ** Function to handle Add Event Click
  const handleAddEventClick = (e) => {
    toggleSidebar(false)

    handleAddEventSidebar()
  }

  return (
    <Fragment>
      <div className='sidebar-wrapper'>
        <CardBody className='card-body d-flex justify-content-center my-sm-0 mb-3'>
          <ActivityModal
            Component={Button.Ripple}
            size='sm'
            outline
            color='primary'
            id='create-button'
          >
            <span className='align-middle'>{FM('add-event')}</span>
          </ActivityModal>
        </CardBody>
        <CardBody>
          <h5 className='section-label mb-1'>
            <span className='align-middle'>{FM('filter')}</span>
          </h5>
          <div className='form-check mb-1'>
            <FormGroupCustom
              label={'done'}
              type={'radio'}
              value={1}
              control={control}
              rules={{ required: false }}
              errors={errors}
              //   options={(statusChangeOptions)}
              name={'status'}
              onChange={() =>
                filterData({
                  status: 1
                })
              }
              className='  mb-1 form-check-success'
            />
            <FormGroupCustom
              label={'pending'}
              type={'radio'}
              value={2}
              control={control}
              rules={{ required: false }}
              errors={errors}
              name={'status'}
              onChange={() =>
                filterData({
                  status: 2
                })
              }
              className=' mb-1 form-check-warning'
            />
            <FormGroupCustom
              label={'notApplicable'}
              type={'radio'}
              //values={store}
              control={control}
              rules={{ required: false }}
              errors={errors}
              value={3}
              name={'status'}
              onChange={() =>
                filterData({
                  status: 3
                })
              }
              className='form-check-danger mb-1'
            />
            <FormGroupCustom
              label={'upcoming'}
              type={'radio'}
              value={0}
              control={control}
              rules={{ required: false }}
              errors={errors}
              name={'status'}
              onChange={() =>
                filterData({
                  status: 0
                })
              }
              className='form-check-info mb-1'
            />
            <FormGroupCustom
              label={'all'}
              type={'radio'}
              value={''}
              control={control}
              rules={{ required: false }}
              errors={errors}
              defaultChecked={true}
              //   options={(statusCha}neOptions)}
              name={'status'}
              onChange={() =>
                filterData({
                  status: ''
                })
              }
              className='  mb-2 form-check-primary'
            />
          </div>{' '}
          {/* <div className='calendar-events-filter'>
            {filters?.length &&
              filters?.map(filter => {
                return (
                  <div
                    key={`${filter?.label}-key`}
                    className={classnames('form-check', {
                      [filter?.className]: filter?.className
                    })}
                  >
                    <Input
                      type='checkbox'
                      key={filter?.value}
                      value={filter?.value}
                      className='input-filter'
                      id={`${filter?.value}-event`}
                      checked={store?.selectedCalendars?.includes(filter?.value)}
                      onChange={() => {
                        // dispatch(updateFilter(filter?.value))
                        filterData({
                          status: filter?.value
                        })
                      }}
                    />
                    <Label className='form-check-label' for={`${filter?.label}-event`}>
                      {filter?.label}
                    </Label>
                  </div>
                )
              })}
          </div>
         */}
        </CardBody>
      </div>
      <div className='mt-auto'>
        {/* <img className='img-fluid' src={"https://media-exp1.licdn.com/dms/image/C5622AQEtckuAXbcmHw/feedshare-image-high-res/0/1649500411323?e=2147483647&v=beta&t=45PmvujspdQnxwq_mMj6hrUFCEwK8urls24_zJzN07k"} alt='illustration' /> */}
        <img className='img-fluid' src={illustration} alt='illustration' />
      </div>
    </Fragment>
  )
}

export default SidebarLeft
