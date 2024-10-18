import { useEffect, useState } from 'react'
import DataTable from 'react-data-table-component'
import { ChevronDown, FileText, RefreshCcw, Sliders } from 'react-feather'
import { useForm } from 'react-hook-form'
import ReactPaginate from 'react-paginate'
import { useHistory } from 'react-router-dom'
import { Button, ButtonGroup, Card, CardHeader, CardTitle, UncontrolledTooltip } from 'reactstrap'
import { fileLogHistory } from '../../utility/apis/log'
import { FM } from '../../utility/helpers/common'
import useUser from '../../utility/hooks/useUser'
import { decrypt, formatDateTimeByFormat } from '../../utility/Utils'
import Shimmer from '../components/shimmers/Shimmer'
import FileAccessFilter from './fragment/FIleAccessFilter'
import '@styles/react/libs/tables/react-dataTable-component.scss'
import { useDispatch } from 'react-redux'
const FileLog = () => {
  const dispatch = useDispatch()
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState('1')
  const [rowsPerPage, setRowsPerPage] = useState('20')
  const [page, setPage] = useState(1)
  const { register, errors, handleSubmit } = useForm()
  const [modal, setModal] = useState(false)
  const user = useUser()
  const [filterData, setFilterData] = useState({
    per_page_record: 15,
    top_most_parent_id: user?.top_most_parent_id ?? null,
    title: ''
  })

  const preload = (data) => {
    fileLogHistory({
      page: currentPage,
      perPage: rowsPerPage,
      dispatch,
      success: (e) => {
        setFile(e?.payload)
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
    title: ''
  })

  const history = useHistory()

  const handlePagination = (page) => {
    setPage(page?.selected + 1)
    fileLogHistory({
      page: page.selected + 1,
      perPage: rowsPerPage,
      dispatch,
      success: (e) => {
        setFile(e?.payload)
      },
      loading: setLoading,
      jsonData: filterData
    })
  }
  const handleReload = () => {
    preload()
  }

  function checkURL(file_path) {
    return String(file_path).match(/\.(jpeg|jpg|gif|png)$/) !== null
  }

  const renderOldFilePreview = (file) => {
    if (checkURL(file?.file_path)) {
      return (
        <a role={'button'} target={'_blank'} href={file?.file_path}>
          <img className='rounded' alt={file.name} src={file?.file_path} height='30' width='30' />
        </a>
      )
    } else {
      return (
        <a role={'button'} target={'_blank'} href={file?.file_path}>
          <FileText url={file?.file_path} size='30' />
        </a>
      )
    }
  }

  const activityColumn = [
    {
      name: FM('#'),
      cell: (row, index) => {
        return parseInt(file?.per_page) * (page - 1) + (index + 1)
      },
      maxWidth: '10px'
    },
    {
      name: FM('files'),
      cell: (row, index) => {
        const f = row?.admin_file
        return renderOldFilePreview(f)
      },
      sortable: true,
      minWidth: '170px'
    },
    {
      name: FM('title'),
      selector: (row) => row?.admin_file?.title ?? '',
      sortable: true,
      minWidth: '170px'
    },
    {
      name: FM('created-by'),
      selector: (row) => decrypt(row?.top_most_parent?.name),
      sortable: true,
      minWidth: '170px'
    },

    {
      name: FM('created-for'),
      selector: (row) => decrypt(row?.user?.name),
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
    const count = Math.ceil(file?.total / file?.per_page)
    return (
      <ReactPaginate
        initialPage={parseInt(file?.current_page) - 1}
        disableInitialCallback
        previousLabel={''}
        nextLabel={''}
        breakLabel='...'
        pageCount={count}
        key={parseInt(file?.current_page) - 1}
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
      <FileAccessFilter
        title={FM('file-access-log-filter')}
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
            {FM('file-access-log')}
          </CardTitle>
          <ButtonGroup>
            <UncontrolledTooltip target='reload'>{FM('refresh-data')}</UncontrolledTooltip>
            <UncontrolledTooltip target='filteree'>{FM('filter')}</UncontrolledTooltip>
            <Button.Ripple size='sm' color='dark' id='filteree' onClick={(e) => setModal(e)}>
              <Sliders size='14' on />
            </Button.Ripple>
            <Button.Ripple size='sm' color='secondary' id='reload' onClick={handleReload}>
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
                pagination
                paginationServer
                className='react-dataTable'
                columns={activityColumn}
                noDataComponent={<div className='nodata-class'>{FM('no-record')}</div>}
                sortIcon={<ChevronDown size={10} />}
                paginationComponent={CustomPagination}
                data={file?.data}
              />
            </div>
          </div>
        )}
      </Card>
    </>
  )
}

export default FileLog
