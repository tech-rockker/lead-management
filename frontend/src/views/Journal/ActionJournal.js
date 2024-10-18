import React, { Fragment, useEffect, useState } from 'react'
import { ArrowLeft, Edit, Plus } from 'react-feather'
import { Card, CardBody, CardHeader, Col, Form, InputGroupText, Label, Row } from 'reactstrap'
import { categoriesLoad, categoryChildList } from '../../utility/apis/categories'
//import { categoryChildList } from '../../utility/apis/commons'
import { loadPatientPlanList } from '../../utility/apis/ip'
import { loadUser, viewUser } from '../../utility/apis/userManagement'
import {
  CategoryType,
  forDecryption,
  incompletePatientFields,
  UserTypes
} from '../../utility/Const'
import { FM, isValid, log } from '../../utility/helpers/common'
import Hide from '../../utility/Hide'
import { Permissions } from '../../utility/Permissions'
import Show from '../../utility/Show'
import {
  createAsyncSelectOptions,
  createSelectOptions,
  decryptObject,
  formatDate,
  incompletePatient,
  jsonDecodeAll
} from '../../utility/Utils'
import FormGroupCustom from '../components/formGroupCustom'
import Shimmer from '../components/shimmers/Shimmer'
import BsTooltip from '../components/tooltip'
import IpStepModal from '../masters/ip/fragment/IpStepModal'
import UserModal from '../userManagement/fragment/UserModal'

const ActionJournal = ({
  open = false,
  setDisplay = () => {},
  setSaveLoading = () => {},
  setActiveIndex = () => {},
  action = null,
  setAction = () => {},
  createFor = null,
  ips = null,
  useFieldArray = () => {},
  editIpRes = null,
  ipRes = null,
  reLabel = null,
  getValues = () => {},
  loadingDetails = false,
  requiredEnabled,
  watch,
  setValue,
  edit,
  onSubmit,
  control,
  errors,
  setError
}) => {
  //category
  const [category, setCategory] = useState([])
  const [categoryLoad, setCategoryLoad] = useState(false)
  const [incompleteField, setIncompleteField] = useState(null)

  //subCategory
  const [loadingUser, setLoadingUser] = useState(false)
  const [user, setUser] = useState(false)
  const [patientSelected, setPatientSelected] = useState(null)
  const [addPatient, setAddPatient] = useState(false)
  const [step, setStep] = useState(0)
  const [selectedPatient, setSelectedPatient] = useState(null)
  const [selectedIp, setSelectedIp] = useState(null)
  const [ip, setIp] = useState([])
  const [subCategory, setSubCategory] = useState([])
  const [subLoad, setSubLoad] = useState(false)
  const [journal, setJournal] = useState(null)
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [selectedSubCat, setSelectedSubCat] = useState(null)
  const [checked, setCheck] = useState(false)
  const [patient, setPatient] = useState([])

  const checkboxDropForTen = () => {
    setCheck(!checked)
  }

  const formFields = {}

  const loadCategoryData = async (search, loadedOptions, { page }) => {
    const res = await categoriesLoad({
      async: true,
      page,
      perPage: 100,
      jsonData: { name: search, category_type_id: CategoryType.implementation }
    })
    return createAsyncSelectOptions(res, page, 'name', 'id', setCategory)
  }

  //patient
  const loadPatientOption = async (search, loadedOptions, { page }) => {
    const res = await loadUser({
      async: true,
      page,
      perPage: 100,
      jsonData: { name: search, user_type_id: UserTypes.patient }
    })
    return createAsyncSelectOptions(res, page, 'name', null, setPatient, (x) => {
      return decryptObject(forDecryption, x)
    })
  }
  // sub  Category Options
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
    if (watch('patient_id')) {
      const res = await loadPatientPlanList({
        async: true,
        page,
        perPage: 100,
        jsonData: { name: search, user_id: watch('patient_id') }
      })
      return createAsyncSelectOptions(res, page, 'title', null, setIp)
    } else {
      return {
        options: [],
        hasMore: false
      }
    }
  }
  const loadDetails = (id) => {
    if (isValid(id)) {
      viewUser({
        id,
        loading: setLoadingUser,
        success: (d) => {
          const s = {
            ...d,
            country_id: d?.country?.id ?? '',
            patient_type_id: typeof d?.patient_type_id === 'object' ? d?.patient_type_id : [],
            ...d?.patient_information,
            id: d?.patient_information?.patient_id
          }
          const values = jsonDecodeAll(formFields, s)
          setUser(values)
          setValue('persons', values?.persons)
          setIncompleteField(incompletePatient(incompletePatientFields, values))
        }
      })
    }
  }
  const handleNewIp = (e, f = false) => {
    log('eeeee, e', e)
    // loadIpOption()
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
    loadDetails(watch('user_id'))
  }, [watch('user_id')])

  const handleNewPatient = (e) => {
    loadPatientOption()
    setSelectedPatient({
      label: e?.name,
      value: e?.id
    })
    setValue('user_id', e?.id)
    loadDetails(e?.id)
    setAddPatient(false)
  }
  // const handleNewPatient = (e) => {
  //     log("eeettee, e", e)
  //     loadPatientOption()
  //     setSelectedPatient({
  //         label: e?.name,
  //         value: e?.id
  //     })
  //     setValue("patient_id", e?.id)
  // }
  const handleNewCategory = (e) => {
    loadCategoryData()
    setSelectedCategory({
      label: e?.name,
      value: e?.id
    })
    if (isValid(e)) {
      setValue('category_id', e?.id)
    }
    log('category_id', e)
  }

  const handleNewSubCategory = (e) => {
    loadCatOptions()
    setSelectedSubCat({
      label: e?.name,
      value: e?.id
    })
    setValue('subcategory_id', e?.id)
  }
  useEffect(() => {
    if (edit !== null) {
      loadIpOption()
    }
  }, [watch('patient_id')])

  useEffect(() => {
    if (edit !== null) {
      setValue('ip_id', edit?.ip_id)
      setValue('patient_id', edit?.patient_id)
    }
  }, [edit])

  return (
    <Fragment>
      {loadingDetails ? (
        <>
          <Shimmer style={{ height: 25, marginBottom: 4, borderRadius: 2 }} />
          <Shimmer style={{ height: 20, width: '90%', marginBottom: 4, borderRadius: 2 }} />
          <Shimmer style={{ height: 20, width: '50%', marginBottom: 25, borderRadius: 2 }} />

          <Shimmer style={{ height: 25, marginBottom: 4, borderRadius: 2 }} />
          <Shimmer style={{ height: 20, width: '90%', marginBottom: 4, borderRadius: 2 }} />
          <Shimmer style={{ height: 20, width: '50%', marginBottom: 25, borderRadius: 2 }} />

          <Shimmer style={{ height: 25, marginBottom: 4, borderRadius: 2 }} />
          <Shimmer style={{ height: 20, width: '90%', marginBottom: 4, borderRadius: 2 }} />
          <Shimmer style={{ height: 20, width: '50%', marginBottom: 25, borderRadius: 2 }} />
          <Shimmer style={{ height: 25, marginBottom: 4, borderRadius: 2 }} />
          <Shimmer style={{ height: 20, width: '90%', marginBottom: 4, borderRadius: 2 }} />
          <Shimmer style={{ height: 20, width: '50%', marginBottom: 25, borderRadius: 2 }} />
        </>
      ) : (
        <Form onSubmit={onSubmit}>
          <Row>
            <Col md='6'>
              <FormGroupCustom
                label={'action'}
                name={'comment_action'}
                type={'autocomplete'}
                errors={errors}
                values={edit}
                className='mb-2'
                control={control}
                rules={{ required: false }}
              />
            </Col>
            <Col md='6'>
              <FormGroupCustom
                label={'result'}
                name={'comment_result'}
                type={'autocomplete'}
                errors={errors}
                values={edit}
                className='mb-2'
                control={control}
                rules={{ required: false }}
              />
            </Col>
          </Row>
          {/* 
                    <Show IF={edit !== null}>
                        <Row>

                            <Col md="6">
                                <FormGroupCustom
                                    label={"edit"}
                                    name={"reason_for_editing"}
                                    type={"autocomplete"}
                                    errors={errors}
                                    values={edit}
                                    className="mb-2"
                                    control={control}
                                    rules={{ required: requiredEnabled }} />
                            </Col>
                        </Row>
                       
                    </Show> */}
        </Form>
      )}
    </Fragment>
  )
}

export default ActionJournal
