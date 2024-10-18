import '@styles/react/apps/app-users.scss'
import React, { useEffect, useState } from 'react'
import { useFieldArray, useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import { viewUser } from '../../utility/apis/userManagement'
import { forDecryption, UserTypes } from '../../utility/Const'
import { FM, isValid } from '../../utility/helpers/common'
import { decryptObject, jsonDecodeAll, setValues } from '../../utility/Utils'
import CenteredModal from '../components/modal/CenteredModal'
import BranchDetail from './branchDetails'

const BranchViewModal = ({
  responseData = () => {},
  editIpRes = null,
  noView = false,
  ipRes = null,
  showModal = false,
  handleToggle = () => {},
  setShowModal = () => {},
  branchId = null,
  Component = 'span',
  children = null,
  ...rest
}) => {
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(false)
  const [load, setLoad] = useState(true)
  const [companyData, setCompanyData] = useState(null)
  // const [id, setId] = useState(null)
  const [val, setVal] = useState([])
  const [editData, setEditData] = useState(null)
  const [resLabel, setResLabel] = useState(null)
  const requiredEnabled = true
  const [open, setOpen] = useState(null)
  const [loadingDetails, setLoadingDetails] = useState(false)

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitSuccessful, submitCount, isSubmitted },
    reset,
    setValue,
    watch,
    getValues,
    setError
  } = useForm()

  const handleModal = () => {
    setOpen(!open)
    setShowModal(!open)
    reset()
    setEditData(null)
  }

  const f = {
    company_type_id: 'json',
    name: '',
    email: '',
    branch_id: '',
    contact_number: '',
    personal_number: '',
    organization_number: '',
    country_id: '',
    city: '',
    postal_code: '',
    zipcode: '',
    full_address: '',
    license_key: '',
    license_end_date: '',
    is_substitute: '',
    is_regular: '',
    is_seasonal: '',
    joining_date: '',
    establishment_date: '',
    user_color: '',
    is_file_required: '',
    entry_mode: '',
    documents: 'json'
  }

  const modifyField = (key, value) => {
    return value
  }
  const loadDetails = () => {
    if (isValid(branchId)) {
      viewUser({
        id: branchId,
        jsonData: {
          user_type_id: UserTypes.branch
        },
        loading: setLoad,
        success: (d) => {
          const valuesT = jsonDecodeAll(f, d)
          const values = {
            ...decryptObject(forDecryption, valuesT),
            company_types: d?.company_types?.map((d) => decryptObject(forDecryption, d)),
            top_most_parent: decryptObject(forDecryption, d?.top_most_parent),
            branch: decryptObject(forDecryption, d?.branch)
          }

          setCompanyData(values)
          setValues(f, values, setValue, modifyField)
        }
      })
    }
  }
  console.log(branchId)
  useEffect(() => {
    if (!isValid(branchId)) {
      reset()
    }
    if (isValid(branchId)) {
      loadDetails()
    }
  }, [branchId])

  useEffect(() => {
    if (!branchId) {
      setLoad(false)
      setCompanyData({})
    }
    return () => {}
  }, [])

  useEffect(() => {
    handleToggle(open)
  }, [open])

  const multiSelectHandle = (e) => {
    // eslint-disable-next-line prefer-template
    setVal(Array.isArray(e) ? e.map((x) => '' + x.value) : [])
  }

  const handleClose = (from = null) => {
    handleModal()
  }

  useEffect(() => {
    if (showModal) handleModal()
  }, [showModal])

  return (
    <>
      <CenteredModal
        disableFooter={true}
        title={`${resLabel ? resLabel?.title : ''} ${FM(`branch-details`)}`}
        disableSave={loadingDetails}
        loading={loading}
        modalClass={'modal-xl'}
        open={open}
        handleModal={handleClose}
      >
        <div className='p-2'>
          <BranchDetail
            branchId={branchId}
            edit={companyData}
            reLabel={resLabel}
            useFieldArray={useFieldArray}
            getValues={getValues}
            setError={setError}
            loadingDetails={loadingDetails}
            requiredEnabled={requiredEnabled}
            watch={watch}
            setValue={setValue}
            control={control}
            errors={errors}
          />
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
export default BranchViewModal
