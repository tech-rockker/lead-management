import { useEffect, useState } from 'react'
import DataTable from 'react-data-table-component'
import { ChevronDown, Download, Eye, EyeOff, Plus, RefreshCcw, Sliders } from 'react-feather'
import { useForm } from 'react-hook-form'
import ReactPaginate from 'react-paginate'
import { useHistory } from 'react-router-dom'
import {
  Button,
  ButtonGroup,
  Card,
  CardHeader,
  CardTitle,
  Col,
  UncontrolledTooltip
} from 'reactstrap'
import '@styles/react/libs/tables/react-dataTable-component.scss'
import { useDispatch } from 'react-redux'
import useUser from '../../../../../utility/hooks/useUser'
import useUserType from '../../../../../utility/hooks/useUserType'
import { loadPatientCashier, printCashierData } from '../../../../../utility/apis/patientCashiers'
import { FM, isValid, isValidArray, log } from '../../../../../utility/helpers/common'
import BsTooltip from '../../../../components/tooltip'
import BsPopover from '../../../../components/popover'
import { decrypt, formatDateTimeByFormat, truncateText } from '../../../../../utility/Utils'
import { ReceiptOutlined } from '@material-ui/icons'
import CashierFilter from '../../../../patientCashiers/cashierFilter'
import Show from '../../../../../utility/Show'
import AddPatientCashier from '../../../../patientCashiers/addPatientCashier'
import Shimmer from '../../../../components/shimmers/Shimmer'

const CashierTable = ({ user }) => {
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(false)
  const [userId, setUserId] = useState(null)
  const [page, setPage] = useState(1)
  const [currentPage, setCurrentPage] = useState('1')
  const [rowsPerPage, setRowsPerPage] = useState('15')
  const [filterData, setFilterData] = useState({
    per_page_record: 15,
    patient_id: user?.id
  })
  const userData = useUser()
  const userType = useUserType()
  const [cashier, setCashier] = useState([])
  const [workShiftFilter, setWorkShiftFilter] = useState(false)

  const loadPatCashiers = () => {
    loadPatientCashier({
      page: currentPage,
      perPage: rowsPerPage,
      dispatch,
      success: (e) => {
        setCashier(e?.payload)
      },
      loading: setLoading,
      jsonData: filterData
    })
  }
  useEffect(() => {
    log(new Date(), user)
    if (isValid(user)) {
      if (user?.id !== userId) {
        setUserId(user?.id)
      }
    }
  }, [user])

  useEffect(() => {
    loadPatCashiers()
  }, [filterData])

  const printPatientCashierData = () => {
    printCashierData({
      jsonData: {
        patient_id: userId ?? ''
      }
    })
  }

  const handlePagination = (page) => {
    setPage(page?.selected + 1)
    loadPatientCashier({
      page: page.selected + 1,
      perPage: rowsPerPage,
      dispatch,
      success: (e) => {
        setCashier(e?.payload)
      },
      loading: setLoading,
      jsonData: filterData
    })
  }

  const handleReload = () => {
    loadPatCashiers()
  }

  const activityColumn = [
    {
      name: FM('#'),
      selector: (row, i) => (row.id ? i + 1 : null),
      maxWidth: '10px'
    },
    {
      name: FM('name'),
      sortable: true,
      minWidth: '170px',
      cell: (row) => {
        return decrypt(row?.patient?.name)
      }
    },
    {
      name: FM('receipt-no'),
      selector: 'receipt_no',
      sortable: true,
      minWidth: '150px'
    },

    {
      name: FM('amount'),
      selector: 'amount',
      sortable: true,
      minWidth: '150px'
    },
    {
      name: FM('comment'),
      allowOverflow: true,
      minWidth: '100px',
      cell: (row) => {
        return (
          <Col xs='1' className='p-0'>
            <BsTooltip role='button' className='me-1' title={null}>
              <BsPopover
                trigger='hover'
                title={FM('comment')}
                content={
                  <>
                    <Col md='12'>
                      <p className='m-0 p-0 fw-bold text-secondary'>
                        {truncateText(row?.comment, 100)}
                      </p>
                    </Col>
                  </>
                }
              >
                <ReceiptOutlined style={{ width: 20, height: 20 }} />
              </BsPopover>
            </BsTooltip>
          </Col>
        )
      }
    },
    {
      name: FM('type'),
      selector: 'type',
      sortable: true,
      minWidth: '100px',
      cell: (row) => {
        return <>{row?.type === '1' ? 'In' : 'Out'}</>
      }
    },
    {
      name: FM('date'),
      selector: ({ value }) => {
        return value !== null ? formatDateTimeByFormat(value, 'YYYY-MM-DD') : ''
      },
      sortable: true,
      minWidth: '100px'
    },
    {
      name: FM('actions'),
      allowOverflow: true,
      minWidth: '70px',
      cell: (row) => {
        return (
          <ButtonGroup>
            {/* <Hide IF={row?.file === null}> */}
            {row?.file !== null ? (
              <BsTooltip
                className='ms-1'
                Tag={'a'}
                role={'button'}
                target={'_blank'}
                href={row?.file}
                title={FM('document')}
              >
                <Eye size='18' />
              </BsTooltip>
            ) : (
              <BsTooltip className='ms-1' Tag={'a'} role={'button'} title={FM('no-document')}>
                <EyeOff size='18' />
              </BsTooltip>
            )}
            {/* </Hide> */}
          </ButtonGroup>
        )
      }
    }
  ]

  const CustomPagination = () => {
    const count = Math.ceil(cashier?.total / cashier?.per_page)
    return (
      <ReactPaginate
        initialPage={parseInt(cashier?.current_page) - 1}
        disableInitialCallback
        previousLabel={''}
        nextLabel={''}
        breakLabel='...'
        pageCount={count}
        key={parseInt(cashier?.current_page) - 1}
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
      <CashierFilter
        show={workShiftFilter}
        filterData={filterData}
        setFilterData={setFilterData}
        handleFilterModal={() => {
          setWorkShiftFilter(false)
        }}
      />
      <Card>
        <CardHeader className='border-bottom inline'>
          <CardTitle className='text-primary' tag='h4'>
            {FM('patient-cashier')}
          </CardTitle>
          <ButtonGroup>
            <Show IF={Permissions.patientCashiersAdd}>
              <UncontrolledTooltip target='create-button'>{FM('create-new')}</UncontrolledTooltip>
              <AddPatientCashier
                Component={Button.Ripple}
                size='sm'
                color='primary'
                id='create-button'
              >
                <Plus size='16' />
              </AddPatientCashier>
            </Show>
            <UncontrolledTooltip target='print'>{FM('print')}</UncontrolledTooltip>
            <Button.Ripple onClick={printPatientCashierData} size='sm' color='secondary' id='print'>
              <Download size='16' />
            </Button.Ripple>
            <UncontrolledTooltip target='reload'>{FM('refresh-data')}</UncontrolledTooltip>
            <Button.Ripple
              onClick={() => setWorkShiftFilter(true)}
              size='sm'
              color='secondary'
              id='filter'
            >
              <Sliders size='16' />
            </Button.Ripple>
            <Button.Ripple size='sm' color='dark' id='reload' onClick={handleReload}>
              <RefreshCcw size='14' />
            </Button.Ripple>
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
                data={isValidArray(cashier?.data) ? cashier?.data : []}
              />
            </div>
          </div>
        )}
      </Card>
    </>
  )
}

export default CashierTable
