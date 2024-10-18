import { ThemeColors } from '@src/utility/context/ThemeColors'
import React, { useCallback, useContext, useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import Hide from '../../utility/Hide'
import useModules from '../../utility/hooks/useModules'
import Show from '../../utility/Show'
import NoActiveModule from '../components/NoModule'
import Basic from './journalLineCard/Basic'

const Journal = ({ user = null }) => {
  const { colors } = useContext(ThemeColors)

  const [formVisible, setFormVisible] = useState(false)
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(false)
  const [edit, setEdit] = useState(null)
  const [filterData, setFilterData] = useState({
    perPage: 10,
    page: '',
    status: 0
  })
  const [reload, setReload] = useState(false)
  const [showAdd, setShowAdd] = useState(false)
  const [showDetails, setShowDetails] = useState(false)
  const { ViewActivity, ViewDeviation, ViewJournal, ViewSchedule } = useModules()

  const escFunction = useCallback((event) => {
    if (event.keyCode === 27) {
      setEdit(null)
      setFormVisible(false)
    }
  }, [])

  // useEffect(() => {
  //     if (filterData !== null) setReload(true)
  // }, [filterData])

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
  }

  return (
    <>
      {/* <AddJournal showModal={showAdd} setShowModal={handleClose} journalId={edit?.id} noView /> */}
      {/* <Header
                titleCol="4"
                childCol='8'
                icon={<FileText />}
            >
              
                <ButtonGroup color='dark'>
                    <Show IF={Permissions.journalSelfBrowse}>
                        <AddJournal Component={Button.Ripple} className='btn btn-primary btn-sm' size="sm" outline color="dark">
                            <Plus size="14" />
                        </AddJournal>
                    </Show>
                </ButtonGroup>
            </Header> */}
      {/* {JournalCard()} */}
      <Show IF={ViewJournal}>
        <Basic showModal={showAdd} user={user} setShowModal={handleClose} />
      </Show>
      <Hide IF={ViewJournal}>
        <NoActiveModule module='journal' />
      </Hide>
      {/* <TableGrid
                // refresh={reload}
                // isRefreshed={setReload}
                // loadFrom={loadUser}
                // jsonData={{
                //     user_type_id: UserTypes.branch,
                //     ...filterData
                // }}
                // selector="userManagement"
                // state="users"
                display="grid"
                gridCol="6"
                // gridView={gridView1}
                gridView={JournalCard}
            /> */}
    </>
  )
}

export default Journal
