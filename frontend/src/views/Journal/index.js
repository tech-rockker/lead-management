import React, { useContext, useCallback, useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { ThemeColors } from '@src/utility/context/ThemeColors'

const JournalList = ({ user = null }) => {
  const { colors } = useContext(ThemeColors)

  const [formVisible, setFormVisible] = useState(false)
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(false)
  const [edit, setEdit] = useState(null)
  const [filterData, setFilterData] = useState(null)
  const [reload, setReload] = useState(false)
  const [showAdd, setShowAdd] = useState(false)
  const [showDetails, setShowDetails] = useState(false)

  const escFunction = useCallback((event) => {
    if (event.keyCode === 27) {
      setEdit(null)
      setFormVisible(false)
    }
  }, [])

  useEffect(() => {
    if (filterData !== null) setReload(true)
  }, [filterData])

  useEffect(() => {
    document.addEventListener('keydown', escFunction, false)

    return () => {
      document.removeEventListener('keydown', escFunction, false)
    }
  }, [])
  const handleClose = (e) => {
    if (e === false) {
      setShowAdd(false)
      setShowDetails(false)
    }

    return <></>
  }
}
