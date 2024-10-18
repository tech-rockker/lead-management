import '@styles/react/libs/tables/react-dataTable-component.scss'
import { useEffect, useState } from 'react'
import DataTable from 'react-data-table-component'
import { ChevronDown, Download, RefreshCcw, Sliders } from 'react-feather'
import ReactPaginate from 'react-paginate'
import { useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { Button, ButtonGroup, Card, CardHeader, CardTitle, UncontrolledTooltip } from 'reactstrap'
import { bankIDLog } from '../../utility/apis/log'
import { FM, isValidArray } from '../../utility/helpers/common'
import useUser from '../../utility/hooks/useUser'
import Show from '../../utility/Show'
import { formatDateTimeByFormat } from '../../utility/Utils'
import Shimmer from '../components/shimmers/Shimmer'
import BsTooltip from '../components/tooltip'
import FilterBankIdLog from './fragment/FilterBankIdLog'
const BankIDLog = () => {
  const dispatch = useDispatch()
  const [bank, setBank] = useState(null)
  const [loading, setLoading] = useState(false)
  const [modal, setModal] = useState(false)
  const [page, setPage] = useState(1)
  const [currentPage, setCurrentPage] = useState('1')
  const [rowsPerPage, setRowsPerPage] = useState('15')
  const user = useUser()
  const [filterData, setFilterData] = useState({
    per_page: 15,
    top_most_parent_id: user?.top_most_parent_id ?? null,
    personnel_number: '',
    name: ''
  })

  const preload = (data) => {
    bankIDLog({
      page: 1,
      perPage: rowsPerPage,
      dispatch,
      success: (e) => {
        setBank(e?.payload)
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
    per_page: '',
    top_most_parent_id: '',
    personnel_number: '',
    name: ''
  })

  const history = useHistory()

  const handlePagination = (page) => {
    setPage(page?.selected + 1)
    bankIDLog({
      page: page.selected + 1,
      perPage: rowsPerPage,
      dispatch,
      success: (e) => {
        setBank(e?.payload)
      },
      loading: setLoading,
      jsonData: filterData
    })
  }

  const handleReload = () => {
    preload()
  }

  const exportData = () => {
    if (isValidArray(bank?.data)) {
      bankIDLog({
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
        return parseInt(bank?.per_page) * (page - 1) + (index + 1)
      },
      maxWidth: '10px'
    },
    {
      name: FM('company-name'),
      selector: (row) => row.company?.company_setting?.company_name ?? '',
      sortable: true,
      minWidth: '200px'
    },
    {
      name: FM('name'),
      selector: 'name',
      sortable: true,
      minWidth: '200px'
    },
    {
      name: FM('personnel-number'),
      selector: 'personnel_number',
      sortable: true,
      minWidth: '240px'
    },
    {
      name: FM('session-Id'),
      selector: 'sessionId',
      sortable: true,
      minWidth: '300px'
    },
    {
      name: FM('ip-address'),
      selector: 'ip',
      sortable: true,
      minWidth: '170px'
    },
    {
      name: FM('request-from'),
      selector: 'request_from',
      sortable: true,
      minWidth: '200px'
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
    const count = Math.ceil(bank?.total / bank?.per_page)
    return (
      <ReactPaginate
        initialPage={parseInt(bank?.current_page) - 1}
        disableInitialCallback
        previousLabel={''}
        nextLabel={''}
        breakLabel='...'
        pageCount={count}
        key={parseInt(bank?.current_page) - 1}
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
      <FilterBankIdLog
        title={FM('bank-id-filter')}
        show={modal}
        setFilterData={(e) => {
          setFilterData({
            ...filterData,
            ...e
          })
        }}
        filterData={filterData}
        handleFilterModal={(e) => setModal(e)}
      />
      <Card>
        <CardHeader className='border-bottom inline'>
          <CardTitle className='text-primary' tag='h4'>
            {FM('bankID-log')}
          </CardTitle>
          <ButtonGroup>
            <UncontrolledTooltip target='reload'>{FM('refresh-data')}</UncontrolledTooltip>
            <UncontrolledTooltip target='filteree'>{FM('filter')}</UncontrolledTooltip>
            <Button.Ripple size='sm' color='dark' id='filteree' onClick={() => setModal(true)}>
              <Sliders size='14' on />
            </Button.Ripple>
            <Button.Ripple size='sm' color='secondary' id='reload' onClick={handleReload}>
              <RefreshCcw size='14' />
            </Button.Ripple>
            <Show IF={isValidArray(bank?.data)}>
              <BsTooltip
                size='sm'
                color='primary'
                title={FM('export')}
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
                data={bank?.data}
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

export default BankIDLog
