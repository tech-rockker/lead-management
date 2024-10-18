import '@styles/react/apps/app-users.scss'
import React, { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import { useParams } from 'react-router-dom'
import { Form, Label } from 'reactstrap'
import { loadComp, loadCompOnly } from '../../../utility/apis/companyApis'
import { addLicense, editLicense, viewLicense } from '../../../utility/apis/licenseApis'
import { loadModule } from '../../../utility/apis/moduleApis'
import { loadPackages } from '../../../utility/apis/packagesApis'
import { FM, isValid, log } from '../../../utility/helpers/common'
import Hide from '../../../utility/Hide'
import Show from '../../../utility/Show'
import {
  addDay,
  createAsyncSelectOptions,
  formatDate,
  isObjEmpty,
  jsonDecodeAll,
  JsonParseValidate,
  setValues,
  updateRequiredOnly
} from '../../../utility/Utils'
import FormGroupCustom from '../../components/formGroupCustom'
import SideModal from '../../components/sideModal/sideModal'

const LicenseAddUpdate = ({ show, handleModal, edit = null, setReload = () => {} }) => {
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
  const [load, setLoad] = useState(true)
  const params = useParams()
  const [companyData, setCompanyData] = useState(null)
  const id = params.id
  const [comp, setComp] = useState([])
  const [packaged, setPackaged] = useState([])
  const ref = useRef()
  const [val, setVal] = useState([])
  const [licenseKey, setLicenseKey] = useState(null)
  const [module, setModule] = useState([])
  const [open, setOpen] = useState(show)

  const loadTypeOptions = async (search, loadedOptions, { page }) => {
    const res = await loadCompOnly({
      async: true,
      page,
      perPage: 100,
      jsonData: { name: search }
    })
    return createAsyncSelectOptions(res, page, 'company_name', 'user_id', setComp)
  }

  const loadPackageOptions = async (search, loadedOptions, { page }) => {
    const res = await loadPackages({
      async: true,
      page,
      perPage: 100,
      jsonData: { name: search }
    })
    return createAsyncSelectOptions(res, page, 'name', null, setPackaged)
  }

  const loadModulesOptions = async (search, loadedOptions, { page }) => {
    const res = await loadModule({
      async: true,
      page,
      perPage: 100,
      jsonData: { name: search }
    })
    return createAsyncSelectOptions(res, page, 'name', 'id', setModule)
  }

  useEffect(() => {
    //  log(ref)
  }, [])

  // Show/Hide Modal
  useEffect(() => {
    if (show) setOpen(true)
  }, [show])

  useEffect(() => {
    if (edit && !isObjEmpty(edit)) {
    }
  }, [edit])

  // form data
  const formFields = {
    user_id: edit?.top_most_parent_id,
    licence_key: '',
    // license_end_date: "",
    package_id: '',
    modules: '',
    module_attached: 'json',
    package_details: 'json',
    expire_at: ''
  }

  const onSubmit = (data) => {
    if (isValid(companyData?.id)) {
      editLicense({
        id: companyData?.id,
        jsonData: data,
        dispatch,
        loading: setLoading,
        success: () => {
          setReload(true)
          setOpen(false)
          handleModal(false)
        }
      })
    } else {
      addLicense({
        jsonData: {
          ...data
        },
        loading: setLoading,
        dispatch,
        success: () => {
          setReload(true)
          setOpen(false)
          handleModal(false)
        }
      })
    }
  }
  const modifyField = (key, value) => {
    return value
  }

  const loadDetails = () => {
    if (isValid(edit?.id)) {
      viewLicense({
        id: edit?.id,
        loading: setLoad,
        success: (d) => {
          let values = jsonDecodeAll(formFields, {
            ...d,
            user_id: d?.top_most_parent_id
          })
          values = {
            ...values,
            package_id: values?.package_details?.id,
            modules: values?.module_attached
            // license_end_date: values?.expire_at
          }
          log('sda', values)
          setCompanyData(values)
          setValues(formFields, values, setValue, modifyField)
        }
      })
    }
  }

  useEffect(() => {
    if (!isValid(edit?.id)) {
      reset()
    }
    if (!isValid(companyData)) {
      loadDetails()
    }
  }, [companyData])

  useEffect(() => {
    if (!edit?.id) {
      setLoad(false)
      setCompanyData({})
    }
    return () => {}
  }, [])

  const multiSelectHandle = (e) => {
    // eslint-disable-next-line prefer-template
    setVal(Array.isArray(e) ? e.map((x) => '' + x.value) : [])
  }
  log(val)

  const clearErrors = () => {}

  const makeUid = () => {
    // const string = String(new Date().getTime())
    const str = 'abcdefghijklmnopqrstuvwxyz123456789'

    let string = ''
    for (let i = 0; i < 20; i++) {
      string += str[Math.floor(Math.random() * str.length)]
    }
    const final = `${string.slice(0, 5)}-${string.slice(5, 10)}-${string.slice(
      10,
      15
    )}-${string.slice(15, 20)}`

    setLicenseKey(`${final.toUpperCase()}`)
    setValue('licence_key', `${final.toUpperCase()}`)
    clearErrors('licence_key')
  }

  return (
    <SideModal
      loading={loading}
      handleSave={handleSubmit(onSubmit)}
      open={open}
      handleModal={() => {
        setOpen(false)
        handleModal(false)
        reset()
      }}
      title={edit ? 'edit-licence' : 'create-new-licence'}
      done='save'
    >
      <Form>
        <FormGroupCustom
          label={'company'}
          type={'select'}
          async
          key={`companyType-${comp.length}`}
          value={companyData?.user_id}
          defaultOptions
          control={control}
          options={comp}
          loadOptions={loadTypeOptions}
          name={'user_id'}
          rules={{ required: true }}
          className='mb-2'
          isDisabled={edit}
        />
        <FormGroupCustom
          label={FM('Modules')}
          key={`module-${module}`}
          name={'modules'}
          errors={errors}
          type={'select'}
          async
          isMulti
          className='mb-2'
          defaultOptions
          // matchWith={"id"}
          value={companyData?.module_attached}
          control={control}
          rules={{ required: true }}
          options={module}
          loadOptions={loadModulesOptions}
        />
        <FormGroupCustom
          name={'package_id'}
          errors={errors}
          type={'select'}
          async
          className='mb-2'
          defaultOptions
          matchWith={'id'}
          value={companyData?.package_details?.id}
          control={control}
          rules={{ required: true }}
          options={packaged}
          loadOptions={loadPackageOptions}
        />
        <Hide IF={edit}>
          <Show IF={isValid(companyData?.package_id) || isValid(watch('package_id'))}>
            <Label>
              {FM('licence-key')} <span className='text-danger'>*</span>{' '}
              <span onClick={makeUid} className='text-small-12 text-primary mb-0' role={'button'}>
                ({FM('create-licence-key')})
              </span>
            </Label>
            <FormGroupCustom
              disabled={isValid(companyData?.package_id)}
              noLabel={!isValid(companyData?.package_id)}
              key={`licenceKey-${licenseKey}-${companyData?.licence_key}`}
              name={`licence_key`}
              label={FM('licence-key')}
              type={'text'}
              errors={errors}
              className='mb-2'
              control={control}
              rules={{ required: true }}
              value={licenseKey ?? companyData?.licence_key}
            />
          </Show>
        </Hide>
        <Show IF={isValid(companyData?.package_id) || isValid(watch('package_id'))}>
          <FormGroupCustom
            label={'expire-at'}
            name={'expire_at'}
            key={formatDate(
              new Date(
                addDay(
                  new Date(),
                  packaged?.find((a) => a.value.id === watch('package_id'))?.value?.validity_in_days
                )
              ),
              'YYYY-MM-DD'
            )}
            setValue={setValue}
            type={'date'}
            errors={errors}
            className='mb-2'
            control={control}
            rules={{ required: false }}
            value={formatDate(
              new Date(
                addDay(
                  new Date(),
                  packaged?.find((a) => a.value.id === watch('package_id'))?.value?.validity_in_days
                )
              ),
              'YYYY-MM-DD'
            )}
          />
        </Show>
      </Form>
    </SideModal>
  )
}
export default LicenseAddUpdate
