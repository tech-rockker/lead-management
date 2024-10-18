import diff from 'deep-diff'
import { isEmptyObject } from 'jquery'
import React, { useCallback, useEffect, useState } from 'react'
import ReactPaginate from 'react-paginate'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom'
import { Col, Row } from 'reactstrap'
import { FM, isValid, log } from '../../../utility/helpers/common'
import GridShimmer from './gridShimmer'
import GridView from './gridView'
import Hide from '../../../utility/Hide'
import { getCounts, ViewAllLink } from '../../../utility/Utils'
import Show from '../../../utility/Show'
const TableGrid = ({
  gridClassName = '',
  columns,
  force = false,
  selector = 'user',
  refresh = false,
  isRefreshed = () => {},
  gridView = () => {},
  state = null,
  gridCol = '4',
  jsonData = null,
  params = null,
  loadFrom = () => {},
  display = 'grid',
  shimmer = null,
  folderId = null,
  isBookmarked,
  searchKey = null,
  ...extra
}) => {
  const location = useLocation()
  const selected = useSelector((s) => s[selector])
  const dispatch = useDispatch()
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [json, setJson] = useState(null)

  const path =
    location.pathname === '/settings/manageFiles'
      ? '/settings/manageFiles/files'
      : '/settings/myFavorites/files'

  const perPage =
    location.pathname === '/settings/manageFiles' || location.pathname === '/settings/myFavorites'
      ? 12
      : 28
  const data = selected[state]
  const counts = getCounts(data, null, null)

  useEffect(() => {
    log('refreshing start')

    if (state) {
      if (!isEmptyObject(selected[state]) && refresh) {
        log('refreshing')
        const d = diff(jsonData, json) // undefined if equal
        let p = page
        log(jsonData, json)
        if (isValid(d) || searchKey) {
          setJson(jsonData)
          p = 1
        } else {
          p = 1
        }
        loadFrom({
          page: p,
          perPage,
          jsonData,
          params,
          is_bookmark: isBookmarked,
          folder_id: folderId,
          search_key: searchKey,
          loading: (l) => {
            setLoading(l)
            isRefreshed(false)
            setPage(1)
          },
          dispatch
        })
      }
    }
  }, [refresh])

  const loadData = useCallback(() => {
    log('paging start')

    if (state && page > 0) {
      if (!isEmptyObject(selected[state])) {
        const d = diff(jsonData, json) // undefined if equal
        let p = page
        log('jsonData', jsonData, json)
        if (isValid(d) || searchKey) {
          setJson(jsonData)
          p = 1
        }
        log('paging')
        loadFrom({
          page: p,
          perPage,
          jsonData,
          params,
          is_bookmark: isBookmarked,
          folder_id: folderId,
          search_key: searchKey,
          loading: (l) => {
            setLoading(l)
            isRefreshed(false)
          },
          dispatch
        })
      }
    }
  }, [page, perPage, json, selected, jsonData, params, state])

  useEffect(() => {
    loadData()
  }, [page, perPage, searchKey])

  if (state) {
    if (display === 'grid') {
      return (
        <>
          <Hide
            IF={
              selected[state]?.total <= perPage || (!loading && selected[state]?.data?.length === 0)
            }
          >
            <Show
              IF={
                location.pathname === '/settings/manageFiles' ||
                location.pathname === '/settings/myFavorites'
              }
            >
              <ViewAllLink path={path} label={FM('view-all-files')} />
            </Show>
          </Hide>
          <GridView
            gridClassName={gridClassName}
            gridView={gridView}
            columns={columns}
            gridCol={gridCol}
            data={selected[state]}
            loading={loading}
            shimmer={shimmer ? shimmer : <GridShimmer />}
            {...extra}
          />
          {!loading && selected[state]?.data?.length === 0 ? (
            <>
              <div className='d-flex justify-content-center my-2'> {FM('no-record')} </div>
            </>
          ) : null}
          <Hide
            IF={
              location.pathname === '/settings/manageFiles' ||
              location.pathname === '/settings/myFavorites'
            }
          >
            <Row>
              <Col xl='12' md='12'>
                <ReactPaginate
                  initialPage={parseInt(selected[state]?.current_page) - 1}
                  disableInitialCallback
                  onPageChange={(page) => {
                    setPage(page?.selected + 1)
                  }}
                  pageCount={counts}
                  key={parseInt(selected[state]?.current_page) - 1}
                  nextLabel={''}
                  breakLabel={'...'}
                  breakClassName='page-item'
                  breakLinkClassName='page-link'
                  activeClassName={'active'}
                  pageClassName={'page-item'}
                  previousLabel={''}
                  nextLinkClassName={'page-link'}
                  nextClassName={'page-item next'}
                  previousClassName={'page-item prev'}
                  previousLinkClassName={'page-link'}
                  pageLinkClassName={'page-link'}
                  containerClassName={'pagination react-paginate justify-content-center'}
                />
              </Col>
            </Row>
          </Hide>
        </>
      )
    }
  } else {
    return null
  }
}

export default TableGrid
