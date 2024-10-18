import { ReceiptOutlined } from '@material-ui/icons'
import '@styles/react/libs/tables/react-dataTable-component.scss'
import { useEffect, useState } from 'react'
import DataTable from 'react-data-table-component'
import { ChevronDown, Download, Eye, EyeOff, Plus, RefreshCcw, Sliders } from 'react-feather'
import { useForm } from 'react-hook-form'
import ReactPaginate from 'react-paginate'
import { useDispatch } from 'react-redux'
import {
  Button,
  ButtonGroup,
  Card,
  CardHeader,
  CardTitle,
  Col,
  UncontrolledTooltip
} from 'reactstrap'
import { UserTypes, forDecryption } from '../../utility/Const'
import { Permissions } from '../../utility/Permissions'
import Show from '../../utility/Show'
import {
  createAsyncSelectOptions,
  decryptObject,
  formatDateTimeByFormat
} from '../../utility/Utils'
import { loadPatientCashier, printCashierData } from '../../utility/apis/patientCashiers'
import { loadUser } from '../../utility/apis/userManagement'
import { FM, isValid, isValidArray, log } from '../../utility/helpers/common'
import useUser from '../../utility/hooks/useUser'
import useUserType from '../../utility/hooks/useUserType'
import FormGroupCustom from '../components/formGroupCustom'
import BsPopover from '../components/popover'
import Shimmer from '../components/shimmers/Shimmer'
import BsTooltip from '../components/tooltip'
import AddPatientCashier from './addPatientCashier'
import CashierFilter from './cashierFilter'

const CashierTable = ({ user }) => {
  const dispatch = useDispatch()
  const userType = useUserType()
  const userData = useUser()
  const { register, errors, handleSubmit, control } = useForm()
  const [loading, setLoading] = useState(false)
  const [userId, setUserId] = useState(null)
  const [page, setPage] = useState(1)
  const [currentPage, setCurrentPage] = useState('1')
  const [rowsPerPage, setRowsPerPage] = useState('15')
  const [filterData, setFilterData] = useState({
    per_page_record: 15,
    patient_id: userId ?? user?.id ?? undefined
  })
  const [cashier, setCashier] = useState([])
  const [patient, setPatient] = useState([])
  const [workShiftFilter, setWorkShiftFilter] = useState(false)

  const loadPatCashiers = () => {
    loadPatientCashier({
      page: currentPage,
      perPage: rowsPerPage,
      dispatch,
      success: (e) => {
        const data = e?.payload?.data?.map((d, i) => {
          return {
            ...decryptObject(forDecryption, d),
            patient: decryptObject(forDecryption, d?.patient)
          }
        })
        setCashier({ ...e?.payload, data })
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

  const printPatientCashierData = () => {
    if (isValidArray(cashier?.data)) {
      printCashierData({
        jsonData: {
          patient_id: userId ?? user?.id ?? filterData?.patient_id
        }
      })
    }
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
        return row?.patient?.name
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
            {isValid(row?.comment) ? (
              <BsPopover
                trigger='hover'
                title={FM('comment')}
                content={
                  <>
                    {/* <Col md="12"> */}
                    <p
                      className='m-0 p-0 fw-bold text-secondary'
                      style={{ maxHeight: 200, overflowY: 'scroll' }}
                    >
                      {row?.comment}
                    </p>
                    {/* </Col> */}
                  </>
                }
              >
                <ReceiptOutlined style={{ width: 20, height: 20 }} />
              </BsPopover>
            ) : (
              ''
            )}
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
      selector: ({ date }) => {
        return date !== null ? formatDateTimeByFormat(date, 'YYYY-MM-DD') : ''
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
          <div>
            <ButtonGroup>
              <FormGroupCustom
                noGroup
                noLabel
                type={'select'}
                async
                isClearable
                value={filterData?.patient_id}
                control={control}
                matchWith='id'
                onChangeValue={(v) => {
                  setFilterData({
                    ...filterData,
                    patient_id: v,
                    patient_name: patient?.find((a) => a.value?.id === v)?.value?.name
                  })
                }}
                options={patient}
                loadOptions={loadPatientOption}
                name={'patient_id'}
                placeholder={FM('select-patient')}
                className='flex-1 z-index-999 flex-1'
              />
            </ButtonGroup>
            <ButtonGroup className='ms-1'>
              <Show IF={Permissions.patientCashiersAdd}>
                <UncontrolledTooltip target='create-button'>{FM('create-new')}</UncontrolledTooltip>
                <AddPatientCashier
                  patientId={filterData?.patient_id}
                  setReload={(e) => {
                    log('dsadasas', e)
                    loadPatCashiers()
                  }}
                  Component={Button.Ripple}
                  size='sm'
                  color='primary'
                  id='create-button'
                >
                  <Plus size='16' />
                </AddPatientCashier>
              </Show>

              <Show IF={isValid(filterData?.patient_id)}>
                <UncontrolledTooltip target='print'>{FM('download')}</UncontrolledTooltip>
                <Button.Ripple
                  onClick={printPatientCashierData}
                  size='sm'
                  color='secondary'
                  id='print'
                >
                  <Download size='16' />
                </Button.Ripple>
              </Show>
              <UncontrolledTooltip target='filter'>{FM('filter')}</UncontrolledTooltip>
              <Button.Ripple
                onClick={() => setWorkShiftFilter(true)}
                size='sm'
                color='secondary'
                id='filter'
              >
                <Sliders size='16' />
              </Button.Ripple>
              <UncontrolledTooltip target='reload'>{FM('refresh-data')}</UncontrolledTooltip>
              <Button.Ripple size='sm' color='dark' id='reload' onClick={handleReload}>
                <RefreshCcw size='14' />
              </Button.Ripple>
            </ButtonGroup>
          </div>
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
                data={cashier?.data}
              />
            </div>
          </div>
        )}
      </Card>
    </>
  )
}

export default CashierTable
