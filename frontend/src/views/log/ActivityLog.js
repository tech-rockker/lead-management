import '@styles/react/libs/tables/react-dataTable-component.scss'
import { useEffect, useState } from 'react'
import DataTable from 'react-data-table-component'
import { ChevronDown, Eye, RefreshCcw, Sliders } from 'react-feather'
import { useForm } from 'react-hook-form'
import ReactPaginate from 'react-paginate'
import { useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { Button, ButtonGroup, Card, CardHeader, CardTitle, UncontrolledTooltip } from 'reactstrap'
import { activityLog } from '../../utility/apis/log'
import { FM } from '../../utility/helpers/common'
import { formatDateTimeByFormat } from '../../utility/Utils'
import Shimmer from '../components/shimmers/Shimmer'
import FilterLog from './fragment/FIlterActivityLog'
import ViewActivity from './ViewActivity'

const ActivityLog = () => {
  const dispatch = useDispatch()
  const [activity, setActivity] = useState(null)
  const [loading, setLoading] = useState(false)
  const [formModal, setFormModal] = useState(false)
  const [currentPage, setCurrentPage] = useState('1')
  const [rowsPerPage, setRowsPerPage] = useState('50')
  const { register, errors, handleSubmit } = useForm()
  const [page, setPage] = useState(1)
  const [editId, setEditId] = useState(null)
  const [perPage, setPerPage] = useState(15)
  const [showFilter, setShowFilter] = useState(false)
  const [filterData, setFilterData] = useState({
    per_page_record: 15,
    properties: '',
    log_name: '',
    causer_type: '',
    subject_type: ''
  })

  const preload = (data) => {
    activityLog({
      page: currentPage,
      perPage: rowsPerPage,
      dispatch,
      success: (e) => {
        setActivity(e?.payload)
      },
      loading: setLoading,
      jsonData: filterData
    })
  }

  useEffect(() => {
    preload()
  }, [filterData])

  console.log(activity)

  const handleFilter = (e) => {
    let value = e.target.value
    const name = e.target.name
    const type = e.target.type

    if (type === 'checkbox') {
      value = e.target.checked ? 1 : 0
    }
    setFilterData({
      ...filterData,
      [name]: value
    })
  }
  const [state, setState] = useState({
    properties: ''
  })

  const handleView = (data) => {
    setEditId(data?.id)
    setState(data)
    setFormModal(true)
  }

  const history = useHistory()

  const handleViewModal = () => setFormModal(!formModal)

  const handlePagination = (page) => {
    setPage(page?.selected + 1)
    activityLog({
      page: page.selected + 1,
      perPage: rowsPerPage,
      dispatch,
      success: (e) => {
        setActivity(e?.payload)
      },
      loading: setLoading,
      jsonData: filterData
    })
  }

  const handleReload = () => {
    preload()
  }

  const exportData = () => {
    activityLog({
      jsonData: {
        export: true
      },
      success: (data) => {
        window.open(data?.payload?.url, '_blank')
      }
    })
  }

  const activityColumn = [
    {
      name: FM('#'),
      cell: (row, index) => {
        return parseInt(activity?.per_page) * (page - 1) + (index + 1)
      },
      maxWidth: '10px'
    },
    {
      name: FM('log-name'),
      selector: 'log_name',
      sortable: true,
      minWidth: '240px'
    },

    {
      name: FM('description'),
      selector: 'description',
      sortable: true,
      minWidth: '170px'
    },
    {
      name: FM('subject-type'),
      selector: 'subject_type',
      sortable: true,
      minWidth: '300px'
    },
    {
      name: FM('causer-type'),
      selector: 'causer_type',
      sortable: true,
      minWidth: '170px'
    },
    {
      name: FM('created-at'),
      selector: ({ value }) => {
        return value !== null ? formatDateTimeByFormat(value, 'YYYY-MM-DD HH:mm:ss') : ''
      },
      sortable: true,
      minWidth: '170px'
    },

    {
      name: FM('actions'),
      allowOverflow: true,
      minWidth: '70px',
      cell: (row) => {
        return (
          <ButtonGroup>
            <UncontrolledTooltip placement='top' id='edit' target='view'>
              {FM('view')}
            </UncontrolledTooltip>
            <div
              className='waves-effect btn btn-primary btn-sm'
              id='view'
              onClick={() => handleView(row)}
            >
              <Eye size={15} />
            </div>
          </ButtonGroup>
        )
      }
    }
  ]

  const CustomPagination = () => {
    const count = Math.ceil(activity?.total / activity?.per_page)
    return (
      <ReactPaginate
        initialPage={parseInt(activity?.current_page) - 1}
        disableInitialCallback
        previousLabel={''}
        nextLabel={''}
        breakLabel='...'
        pageCount={count}
        key={parseInt(activity?.current_page) - 1}
        activeClassName='active'
        onPageChange={(page) => handlePagination(page)}
        pageClassName={'page-item'}
        nextLinkClassName={'page-link'}
        nextClassName={'page-item next'}
        previousClassName={'page-item prev'}
        previousLinkClassName={'page-link'}
        pageLinkClassName={'page-link'}
        breakClassName='page-item'
        breakLinkClassName='page-link'
        containerClassName={
          'pagination react-paginate separated-pagination pagination-sm justify-content-end pr-1 mt-1'
        }
      />
    )
  }
  return (
    <>
      <ViewActivity
        setFormModal={(e) => {
          setEditId(null)
          setFormModal(e)
        }}
        formModal={formModal}
        edit={state}
      />
      <FilterLog
        title={FM('activity-filter')}
        show={showFilter}
        setFilterData={(e) => {
          setFilterData({
            ...filterData,
            ...e
          })
        }}
        filterData={filterData}
        handleFilterModal={() => {
          setShowFilter(false)
        }}
      />

      <Card>
        <CardHeader className='border-bottom inline'>
          <CardTitle className='text-primary' tag='h4'>
            {FM('activity-log')}
          </CardTitle>
          <ButtonGroup>
            <UncontrolledTooltip target='reload'>{FM('refresh-data')}</UncontrolledTooltip>
            <UncontrolledTooltip target='filteree'>{FM('filter')}</UncontrolledTooltip>
            <Button.Ripple size='sm' color='dark' id='filteree' onClick={(e) => setShowFilter(e)}>
              <Sliders size='14' on />
            </Button.Ripple>
            <Button.Ripple size='sm' color='secondary' id='reload' onClick={handleReload}>
              <RefreshCcw size='14' />
            </Button.Ripple>
            {/* <BsTooltip size="sm" color="primary" title={"export"} Tag={Button} role={"button"} onClick={exportData}>
                            <Download size={15} />
                        </BsTooltip> */}
          </ButtonGroup>
        </CardHeader>
        {loading ? (
          <>
            <Shimmer style={{ width: '100%', height: 50, marginBottom: 5, marginTop: 5 }} />
            <Shimmer style={{ width: '100%', height: 50, marginBottom: 5 }} />
            <Shimmer style={{ width: '100%', height: 50, marginBottom: 5 }} />
            <Shimmer style={{ width: '100%', height: 50, marginBottom: 5 }} />
            <Shimmer style={{ width: '100%', height: 50, marginBottom: 5 }} />
            <Shimmer style={{ width: '100%', height: 50, marginBottom: 5 }} />
            <Shimmer style={{ width: '100%', height: 50, marginBottom: 5 }} />
            <Shimmer style={{ width: '100%', height: 50, marginBottom: 5 }} />
            <Shimmer style={{ width: '100%', height: 50, marginBottom: 5 }} />
          </>
        ) : (
          <div className='card-datatable app-user-list table-responsive'>
            <div className='react-dataTable'>
              <DataTable
                noHeader
                //  selectableRows
                pagination
                paginationServer
                className='react-dataTable'
                columns={activityColumn}
                noDataComponent={<div className='nodata-class'>{FM('no-record')}</div>}
                sortIcon={<ChevronDown size={10} />}
                paginationComponent={CustomPagination}
                data={activity?.data}
              />
            </div>
          </div>
        )}
      </Card>
      <ViewActivity
        open={formModal}
        setFormModal={setFormModal}
        handleViewModal={handleViewModal}
        handleFilter={handleFilter}
        filterData={filterData}
      />
      {/* <ViewActivityLog open  */}
    </>
  )
}

export default ActivityLog
