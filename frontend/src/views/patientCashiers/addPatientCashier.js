import '@styles/react/apps/app-users.scss'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import { Col, Label, Row } from 'reactstrap'
import { addPatientCashier } from '../../utility/apis/patientCashiers'
import { loadUser } from '../../utility/apis/userManagement'
import { forDecryption, UserTypes } from '../../utility/Const'
import { FM, isValid, isValidArray, log } from '../../utility/helpers/common'
import Hide from '../../utility/Hide'
import { createAsyncSelectOptions, decryptObject, SpaceTrim, Type } from '../../utility/Utils'
import DropZone from '../components/buttons/fileUploader'
import FormGroupCustom from '../components/formGroupCustom'
import CenteredModal from '../components/modal/CenteredModal'

const AddPatientCashier = ({
  patientId = null,
  isEdit = false,
  setFilterData = () => {},
  edit = null,
  noView = false,
  showModal = false,
  setShowModal = () => {},
  setReload = () => {},
  bankId = null,
  Component = 'span',
  children = null,
  ...rest
}) => {
  const dispatch = useDispatch()
  const form = useForm()
  const {
    formState: { errors },
    handleSubmit,
    control,
    reset,
    setValue,
    watch
  } = form
  const [loading, setLoading] = useState(false)
  const [load, setLoad] = useState(false)
  const [open, setOpen] = useState(null)
  const [editData, setEditData] = useState(null)
  const [fileData, setFileData] = useState(null)
  const [loadingDetails, setLoadingDetails] = useState(false)
  const [patient, setPatient] = useState([])
  const [licenseKey, setLicenseKey] = useState(null)

  const handleModal = () => {
    setOpen(!open)
    setShowModal(!open)
    reset()
    setLicenseKey(null)
    setValue('receipt_no', null)
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

  const onSubmit = (data) => {
    log(data)
    addPatientCashier({
      jsonData: {
        ...data,
        patient_id: patientId ?? data?.patient_id
      },
      loading: setLoading,
      dispatch,
      success: (data) => {
        setFilterData({})
        setReload(true)
        console.log(data)
        setOpen(false)
        handleModal(false)
      }
    })
  }

  // const fields = {
  //     patient_id: "",
  //     receipt_no: "",
  //     amount: "",
  //     comment: "",
  //     date: "",
  //     file: "",
  //     type: ""
  // }

  const handleClose = (from = null) => {
    handleModal()
  }

  useEffect(() => {
    if (showModal) handleModal()
  }, [showModal])

  const clearErrors = () => {}

  const makeUid = () => {
    // const string = String(new Date().getTime())
    const str = 'abd1234fgyt56789uujk'

    let string = ''
    for (let i = 0; i < 10; i++) {
      string += str[Math.floor(Math.random() * str.length)]
    }
    const final = `${string.slice(0, 5)}-${string.slice(5, 10)}`

    setLicenseKey(`${final.toUpperCase()}`)
    setValue('receipt_no', `${final.toUpperCase()}`)
    clearErrors('license_key')
  }

  return (
    <>
      <CenteredModal
        title={FM('add-patient-cashier')}
        disableSave={loadingDetails}
        loading={loading}
        modalClass={'modal-lg'}
        open={open}
        handleModal={handleClose}
        handleSave={handleSubmit(onSubmit)}
      >
        <div className='p-2'>
          <Row>
            <Hide IF={isValid(patientId)}>
              <Col md='6'>
                <FormGroupCustom
                  type={'select'}
                  control={control}
                  errors={errors}
                  name={'patient_id'}
                  defaultOptions
                  async
                  cacheOptions
                  loadOptions={loadPatientOption}
                  values={editData}
                  options={patient}
                  label={FM('patient')}
                  rules={{ required: true }}
                  placeholder={editData !== null ? FM('loading') : FM('select')}
                  className='mb-1'
                />
              </Col>
            </Hide>
            <Col md='6'>
              <Label>
                {FM('receipt-no')} <span className='text-danger'>*</span>{' '}
                <span onClick={makeUid} className='text-small-12 text-primary mb-0' role={'button'}>
                  ({FM('create-receipt-no')})
                </span>
              </Label>

              <FormGroupCustom
                noLabel
                key={`licenseKey-${licenseKey}`}
                label={'receipt-no'}
                name={'receipt_no'}
                type={'text'}
                forceValue
                errors={errors}
                value={licenseKey}
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

          <Row>
            <Col md='4'>
              <FormGroupCustom
                name={'date'}
                setValue={setValue}
                type={'date'}
                errors={errors}
                label={FM('date')}
                dateFormat={'YYYY-MM-DD'}
                className='mb-2'
                control={control}
                rules={{ required: true }}
                values={edit}
              />
            </Col>

            <Col md='4'>
              <FormGroupCustom
                label={'type'}
                type={'select'}
                control={control}
                options={Type()}
                name={'type'}
                className='mb-2'
                rules={{ required: true }}
                values={edit}
              />
            </Col>
            <Col md='4'>
              <FormGroupCustom
                label={'amount'}
                name={'amount'}
                type={'number'}
                errors={errors}
                values={editData}
                className='mb-2'
                control={control}
                rules={{ required: true }}
              />
            </Col>
          </Row>
          <Row>
            <Col md='12'>
              <FormGroupCustom
                name={'comment'}
                type={'autocomplete'}
                errors={errors}
                label={FM('comment')}
                className='mb-2'
                control={control}
                rules={{ required: false }}
                values={editData}
              />
            </Col>
          </Row>

          <Col md='12'>
            <FormGroupCustom
              noLabel
              isMulti
              name={'file'}
              type={'hidden'}
              errors={errors}
              control={control}
              rules={{ required: false }}
              values={fileData}
            />
            <DropZone
              value={fileData?.file}
              handleClose={handleClose}
              onSuccess={(e) => {
                if (isValidArray(e)) {
                  setValue('file', {
                    file_name: e[0]?.uploading_file_name,
                    file_url: e[0]?.file_name
                  })
                } else {
                  setValue('file', [])
                }
              }}
            />
          </Col>
        </div>
      </CenteredModal>
      {!noView ? (
        <Component role='button' onClick={handleModal} {...rest}>
          {children}
        </Component>
      ) : null}
    </>
  )
}
export default AddPatientCashier
