import React, { useEffect, useState } from 'react'
import { Activity, User } from 'react-feather'
import { useForm } from 'react-hook-form'
import { Nav, NavItem, NavLink, TabContent, TabPane } from 'reactstrap'
import { listJournalAction } from '../../../utility/apis/journal'
import { forDecryption } from '../../../utility/Const'
import { FM, isValid } from '../../../utility/helpers/common'
import { decryptObject, jsonDecodeAll, setValues } from '../../../utility/Utils'
import ActionList from './ActionList'
import JournalInfo from './JournalInfo'

const JournalTabs = ({ data, loadJournal = () => {} }) => {
  const [active, setActive] = useState('1')

  const toggleTab = (tab) => {
    if (active !== tab) {
      setActive(tab)
    }
  }
  const [id, setId] = useState(null)
  const [actionData, setActionData] = useState(null)
  const [loadingDetails, setLoadingDetails] = useState(false)

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

  useEffect(() => {
    if (data !== null) {
      setActionData(data)
      // setValues(formFields, values, setValue, modifyField)
      // setValues(edit)
      setId(data?.id)
    }
  }, [data])
  const formFields = {
    // parent_id: "",
    // deviation_id: "",
    // top_most_parent_id: "",
    // branch_id: "",
    // patient_id: "",
    // emp_id: "",
    // category_id: "",
    // subcategory_id: "",
    // activity_id: "",
    // date: "",
    // time: "",
    // description: "",
    // is_signed: "",
    // entry_mode: "",
    // status: ""
  }

  const loadDetails = () => {
    if (isValid(id)) {
      listJournalAction({
        jsonData: {
          journal_id: id
        },
        loading: setLoadingDetails,
        success: (a) => {
          const d = {
            ...a
          }
          const valuesT = jsonDecodeAll(formFields, d)
          const values = {
            ...decryptObject(forDecryption, valuesT),
            signed_by: decryptObject(forDecryption, valuesT?.signed_by)
          }
          setActionData(values)
          setValues(formFields, values, setValue)
        }
      })
    }
  }

  useEffect(() => {
    loadDetails()
  }, [id])
  return (
    <div className='white p-25 shadow p-2'>
      <Nav pills className='mb-2  flex-column flex-sm-row'>
        <NavItem>
          <NavLink active={active === '1'} onClick={() => toggleTab('1')}>
            <User className='font-medium-3 me-50' />
            <span className='fw-bold'> {FM('info')} </span>
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink active={active === '2'} onClick={() => toggleTab('2')}>
            <Activity className='font-medium-3 me-50' />
            <span className='fw-bold'> {FM('action')} </span>
          </NavLink>
        </NavItem>
        {/* <NavItem>
                    <NavLink active={active === '3'} onClick={() => toggleTab('3')}>
                        <Activity className='font-medium-3 me-50' />
                        <span className='fw-bold'> {FM("assign")} </span>
                    </NavLink>
                </NavItem> */}
      </Nav>
      <TabContent activeTab={active}>
        <TabPane tabId='1'>
          <JournalInfo data={data} loadingDetails={loadingDetails} />
        </TabPane>
        <TabPane tabId='2'>
          <ActionList
            onSuccess={loadDetails}
            data={data}
            edit={actionData}
            loadingDetails={loadingDetails}
          />
        </TabPane>
        {/* <TabPane tabId='3'>
                    <JournalEmployee data={data} />
                </TabPane> */}
      </TabContent>
    </div>
  )
}

export default JournalTabs
