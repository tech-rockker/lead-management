import React, { useContext, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Col, Row } from 'reactstrap'
import { journalStats, timeReportJournal } from '../../utility/apis/journal'
import Chart from './Chart'
import { ThemeColors } from '@src/utility/context/ThemeColors'
import useModules from '../../utility/hooks/useModules'
import Show from '../../utility/Show'
import Hide from '../../utility/Hide'
import NoActiveModule from '../components/NoModule'

const JournalStats = () => {
  const [reload, setReload] = useState(false)
  const { ViewJournal } = useModules()
  const { colors } = useContext(ThemeColors)
  const dispatch = useDispatch()
  // const activity = useSelector(s => s.activity.activities)
  const journal = useSelector((s) => s.journal.journals)
  // const [activity, setActivity] = useState([])
  const [loading, setLoading] = useState(false)
  const [visibleItems, setVIsible] = useState([])

  const [formVisible, setFormVisible] = useState(false)
  const [activityFilter, setActivityFilter] = useState(false)
  // const [edit, setEdit] = useState(null)
  const [editData, setEditData] = useState(null)

  const [status, setStatus] = useState()
  const [deleted, setDeleted] = useState(null)
  const [failed, setFailed] = useState(false)
  const [added, setAdded] = useState(null)
  const [assignModal, setAssignModal] = useState(false)
  const [filterData, setFilterData] = useState({
    perPage: 25,
    page: '',
    status: ''
  })
  const [showAdd, setShowAdd] = useState(false)
  const [journalFilter, setJournalFilter] = useState(false)
  const [stats, setStats] = useState(null)
  const [showAddTask, setShowAddTask] = useState(false)
  const [showDetails, setShowDetails] = useState(false)
  const [patient, setPatient] = useState(null)
  // const loadJournal = () => {
  //     // if(isValidArray())

  //         journalStats({
  //             perPage: 30,
  //             jsonData: {
  //                 status: "",
  //                 // start_date: formatDate(new Date(), "YYYY-MM-DD"),

  //                 ...filterData

  //             },
  //             loading: setLoading,
  //             dispatch,
  //             success: e => {
  //                 setReload(false)
  //             }
  //         })

  // }

  const loadJournal = () => {
    journalStats({
      perPage: 1000,
      loading: setLoading,
      dispatch,
      success: (e) => {
        setStats(e)
      }
    })
  }

  useEffect(() => {
    loadJournal()
  }, [filterData])

  useEffect(() => {
    if (reload) {
      loadJournal()
    }
  }, [reload])
  //  console.log(stats)
  return (
    <>
      <Row>
        <Show IF={ViewJournal}>
          <Col md='12'>
            <Chart stats={stats} />
          </Col>
        </Show>
        <Hide IF={ViewJournal}>
          <NoActiveModule module='journals' />
        </Hide>
      </Row>
    </>
  )
}

export default JournalStats
