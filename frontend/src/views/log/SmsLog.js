import '@styles/react/libs/tables/react-dataTable-component.scss'
import { useEffect, useState } from 'react'
import DataTable from 'react-data-table-component'
import { ChevronDown, Download, RefreshCcw, Sliders } from 'react-feather'
import { useForm } from 'react-hook-form'
import ReactPaginate from 'react-paginate'
import { useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { Button, ButtonGroup, Card, CardHeader, CardTitle, UncontrolledTooltip } from 'reactstrap'
import { smsLog } from '../../utility/apis/log'
import { FM, isValid, isValidArray } from '../../utility/helpers/common'
import useUser from '../../utility/hooks/useUser'
import Show from '../../utility/Show'
import { formatDateTimeByFormat } from '../../utility/Utils'
import Shimmer from '../components/shimmers/Shimmer'
import BsTooltip from '../components/tooltip'
import FilterLog from './fragment/FilterLog'
const SmsLog = () => {
  const dispatch = useDispatch()
  const [sms, setSms] = useState(null)
  const [loading, setLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState('1')
  const [rowsPerPage, setRowsPerPage] = useState('2')
  const { register, errors, handleSubmit } = useForm()
  const [page, setPage] = useState(1)
  const [showFilter, setShowFilter] = useState(false)
  const user = useUser()
  const [filterData, setFilterData] = useState({
    per_page_record: 15,
    top_most_parent_id: user?.top_most_parent_id ?? null,
    mobile: '',
    name: ''
  })

  const preload = (data) => {
    smsLog({
      page: currentPage,
      perPage: rowsPerPage,
      dispatch,
      success: (e) => {
        setSms(e?.payload)
      },
      loading: setLoading,
      jsonData: filterData
    })
  }

  useEffect(() => {
    preload()
  }, [filterData])

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
    per_page_record: '',
    top_most_parent_id: '',
    mobile: '',
    name: ''
  })

  const history = useHistory()

  const handlePagination = (page) => {
    setPage(page?.selected + 1)
    smsLog({
      page: page.selected + 1,
      perPage: rowsPerPage,
      dispatch,
      success: (e) => {
        setSms(e?.payload)
      },
      loading: setLoading,
      jsonData: filterData
    })
  }

  const handleReload = () => {
    preload()
  }

  const exportData = () => {
    if (isValidArray(sms?.data)) {
      smsLog({
        jsonData: {
          export: true
        },
        success: (data) => {
          window.open(data?.payload?.url, '_blank')
        }
      })
    }
  }

  const activityColumn = [
    {
      name: FM('#'),
      cell: (row, index) => {
        return parseInt(sms?.per_page) * (page - 1) + (index + 1)
      },
      maxWidth: '10px'
    },
    {
      name: FM('company-name'),
      selector: (row) => row.company?.company_setting?.company_name ?? '',
      sortable: true,
      minWidth: '170px'
    },
    {
      name: FM('mobile'),
      selector: 'mobile',
      sortable: true,
      minWidth: '170px'
    },
    {
      name: FM('session-Id'),
      selector: 'sessionId',
      sortable: true,
      minWidth: '240px'
    },

    {
      name: FM('name'),
      selector: 'name',
      sortable: true,
      minWidth: '170px'
    },
    {
      name: FM('created-at'),
      selector: ({ value }) => {
        return value !== null ? formatDateTimeByFormat(value, 'YYYY-MM-DD HH:mm:ss') : ''
      },
      sortable: true
    }
  ]

  const CustomPagination = () => {
    const count = Math.ceil(sms?.total / sms?.per_page)
    return (
      <ReactPaginate
        initialPage={parseInt(sms?.current_page) - 1}
        disableInitialCallback
        previousLabel={''}
        nextLabel={''}
        breakLabel='...'
        pageCount={count}
        key={parseInt(sms?.current_page) - 1}
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
      <FilterLog
        title={FM('sms-log-filter')}
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
            {FM('sms-log')}
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
            <Show IF={isValidArray(sms?.data)}>
              <BsTooltip
                size='sm'
                color='primary'
                title={'export'}
                Tag={Button}
                role={'button'}
                onClick={exportData}
              >
                <Download size={15} />
              </BsTooltip>
            </Show>
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
                data={sms?.data}
                // Link={<Trash2 />}
              />
            </div>
          </div>
        )}
      </Card>

      {/* <ViewActivityLog open  */}
    </>
  )
}

export default SmsLog
