import Avatar from '@components/avatar'
import { ThemeColors } from '@src/utility/context/ThemeColors'
import classNames from 'classnames'
import React, { useCallback, useContext, useEffect, useState } from 'react'
import { RefreshCcw } from 'react-feather'
import { Button, ButtonGroup, Card, CardBody, Col, Row, UncontrolledTooltip } from 'reactstrap'
import { LoadRequest } from '../../../utility/apis/requests'
import { FM, getInitials } from '../../../utility/helpers/common'
import TableGrid from '../../components/tableGrid'
import Header from '../../header'

const Contactus = () => {
  const { colors } = useContext(ThemeColors)
  const [reload, setReload] = useState(false)
  const [added, setAdded] = useState(null)

  const escFunction = useCallback((event) => {
    if (event.keyCode === 27) {
    }
  }, [])

  useEffect(() => {
    document.addEventListener('keydown', escFunction, false)

    return () => {
      document.removeEventListener('keydown', escFunction, false)
    }
  }, [])

  const gridView = (item, index) => {
    return (
      <>
        <Card
          className={classNames({
            'animate__animated animate__bounceIn': index === 0 && item.id === added
          })}
        >
          <CardBody>
            <Row className='align-items-center'>
              <Col xs='2'>
                {item?.img ? (
                  <Avatar img={item?.img} />
                ) : (
                  <Avatar color='light-primary' content={getInitials(item?.name)} />
                )}
              </Col>
              <Col xs='7'>
                <p className='text-truncate m-0'>{item?.name}</p>
                <p className='text-truncate m-0'>{item?.id}</p>
              </Col>
              <Col></Col>
            </Row>
          </CardBody>
        </Card>
      </>
    )
  }

  return (
    <>
      <Header>
        {/* Buttons */}
        <ButtonGroup>
          <UncontrolledTooltip target='reload'>{FM('refresh-data')}</UncontrolledTooltip>

          <Button.Ripple
            size='sm'
            outline
            color='dark'
            id='reload'
            onClick={() => {
              setReload(true)
            }}
          >
            <RefreshCcw size='14' />
          </Button.Ripple>
        </ButtonGroup>
      </Header>

      {/* Category Types */}
      <TableGrid
        refresh={reload}
        isRefreshed={setReload}
        loadFrom={LoadRequest}
        selector='requests'
        state='requests'
        display='grid'
        gridCol='4'
        gridView={gridView}
      />
    </>
  )
}

export default Contactus
