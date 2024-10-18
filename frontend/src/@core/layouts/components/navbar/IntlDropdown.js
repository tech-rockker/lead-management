// ** Third Party Components
import { useEffect, useState } from 'react'
import ReactCountryFlag from 'react-country-flag'
import { ChevronDown } from 'react-feather'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
// ** Reactstrap Imports
import {
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Spinner,
  UncontrolledDropdown
} from 'reactstrap'
import { getAllLanguage } from '../../../../utility/apis/languageLabel'
import { log } from '../../../../utility/helpers/common'
import Show from '../../../../utility/Show'

const IntlDropdown = () => {
  // ** Hooks
  const { i18n } = useTranslation()
  const [loading, setLoading] = useState(false)
  // const dispatch = useDispatch()
  const [language, setLanguage] = useState([])

  const loadLanguage = () => {
    getAllLanguage({
      perPage: 1000,
      loading: setLoading,
      // dispatch,
      success: (e) => {
        setLanguage(e?.data)
      }
    })
  }

  useEffect(() => {
    loadLanguage()
  }, [])

  // ** Vars
  const langObj = {
    en: 'English',
    de: 'German',
    fr: 'French',
    pt: 'Portuguese'
  }

  // ** Function to switch Language
  const handleLangUpdate = (e, lang) => {
    e.preventDefault()
    i18n.changeLanguage(String(lang))
  }

  const getName = (id) => {
    // log(id)
    return language?.find((a) => a.id === parseInt(id))
  }

  return (
    <UncontrolledDropdown href='/' tag='li' className='dropdown-language nav-item'>
      <DropdownToggle href='/' tag='a' className='nav-link' onClick={(e) => e.preventDefault()}>
        <Show IF={loading}>
          <Spinner animation='border' size={'sm'} className='me-1'>
            <span className='visually-hidden'>Loading...</span>
          </Spinner>
        </Show>
        <span className='selected-language'>
          {getName(i18n.language)?.title ?? 'Eng'} <ChevronDown size={14} />
        </span>
      </DropdownToggle>
      <DropdownMenu className='mt-0' end>
        {language?.map((item, index) => {
          return (
            <DropdownItem href='/' tag='a' onClick={(e) => handleLangUpdate(e, item?.id)}>
              <span className='ms-1'> {item?.title} </span>
            </DropdownItem>
          )
        })}
      </DropdownMenu>
    </UncontrolledDropdown>
  )
}

export default IntlDropdown
