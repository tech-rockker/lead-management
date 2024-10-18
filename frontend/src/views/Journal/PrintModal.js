import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Col, Form, Modal, ModalBody, ModalFooter, ModalHeader, Row } from 'reactstrap'
import { UserTypes, forDecryption } from '../../utility/Const'
import {
  SpaceTrim,
  addDay,
  calculateTime,
  createAsyncSelectOptions,
  decryptObject
} from '../../utility/Utils'
import { printJournal } from '../../utility/apis/journal'
import { loadUser } from '../../utility/apis/userManagement'
import { FM, isValid } from '../../utility/helpers/common'
import LoadingButton from '../components/buttons/LoadingButton'
import FormGroupCustom from '../components/formGroupCustom'

const PrintModal = ({ printModal, setPrintModal, handlePrint, patient_id }) => {
  const [patient, setPatient] = useState(null)
  const [loading, setLoading] = useState(false)
  const [time, setTime] = useState(null)
  const [end, setEnd] = useState(null)

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

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
    getValues,
    setError
  } = useForm()

  // useEffect(() => {
  //     loadPatientOption()
  // }, [])
  useEffect(() => {
    const s = isValid(watch('start_date')) ? watch('start_date') : null
    if (s) {
      const e = isValid(watch('end_date')) ? watch('end_date') : addDay(watch('start_date'), 365)
      const getDiff = calculateTime(new Date(s), new Date(e))
      setEnd(e)
      if (getDiff) {
        setTime(getDiff)
      }
    }
  }, [watch('start_date')])

  useEffect(() => {
    const s = isValid(watch('start_date')) ? watch('start_date') : null
    if (s) {
      const e = isValid(watch('end_date')) ? watch('end_date') : addDay(watch('start_date'), 365)
      const getDiff = calculateTime(new Date(s), new Date(e))
      setEnd(e)
      if (getDiff) {
        setTime(getDiff)
      }
    }
  }, [watch('end_date')])

  const handleSave = (data) => {
    if (isValid('reason')) {
      printJournal({
        jsonData: {
          ...data,
          print_with_secret: data?.print_with_secret === 1 ? 'yes' : 'no',
          patient_id
        },
        loading: setLoading,
        success: (e) => {
          window.open(e, '_blank')
          handlePrint()
          console.log(e)
          reset()
          setValue('print_with_secret', false)
        }
      })
    }
  }

  return (
    <Modal
      isOpen={printModal}
      toggle={() => {
        setPrintModal(!printModal)
        setValue('print_with_secret', false)
        reset()
      }}
    >
      <ModalHeader
        toggle={() => {
          setPrintModal(!printModal)
          reset()
          setValue('print_with_secret', false)
        }}
      >
        {FM('export-journal')}
      </ModalHeader>
      <Form onSubmit={handleSubmit(handleSave)}>
        <ModalBody>
          <Row>
            <Col md='12'>
              <p className='text-danger text-small-12'>
                {FM('you-can-leave-dates-blank-to-print-all-journals')}
              </p>
            </Col>
            <Col md='6'>
              <FormGroupCustom
                name={'from_date'}
                type={'date'}
                errors={errors}
                label={FM('start-date')}
                options={{
                  // enable: [function (date) { return enableFutureDates(date) }, new Date()],
                  maxDate: 'today'
                }}
                setValue={setValue}
                className='mb-2'
                control={control}
                // max={formatDate(new Date(), "YYYY-MM-DD")}
                rules={{ required: false }}
              />
            </Col>
            <Col md='6'>
              <FormGroupCustom
                name={'end_date'}
                type={'date'}
                errors={errors}
                options={{
                  // enable: [function (date) { return enableFutureDates(date) }, new Date()],
                  minDate: watch('from_date'),
                  maxDate: 'today'
                }}
                label={FM('end-date')}
                className='mb-2'
                control={control}
                setValue={setValue}
                // max={formatDate(new Date(), "YYYY-MM-DD")}
                rules={{ required: false }}
              />
            </Col>
            <Col md='12'>
              <FormGroupCustom
                name={'print_with_secret'}
                label={FM('print-secret')}
                type={'checkbox'}
                errors={errors}
                setValue={setValue}
                value={watch('print_with_secret')}
                className='mb-2'
                control={control}
                rules={{ required: false }}
              />
            </Col>
            <Col md='12'>
              <FormGroupCustom
                name={'reason'}
                label={FM('reason')}
                type={'autocomplete'}
                errors={errors}
                className='mb-2'
                control={control}
                rules={{
                  required: true,
                  validate: (v) => {
                    return isValid(v) ? !SpaceTrim(v) : true
                  }
                }}
              />
            </Col>
          </Row>
        </ModalBody>
        <ModalFooter>
          <LoadingButton loading={loading} color='primary' type='submit'>
            {FM('download')}
          </LoadingButton>
        </ModalFooter>
      </Form>
    </Modal>
  )
}

export default PrintModal
