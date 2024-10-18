import React from 'react'
import { CardBody, Card, Label, CardHeader, Row, Col } from 'reactstrap'
import { FM } from '../../../../utility/helpers/common'
import MiniTable from '../../../components/tableGrid/miniTable'

function HoursAllow({ data = null }) {
  return (
    <Card>
      <CardHeader>
        <h4>{FM('agencies')}</h4>
      </CardHeader>
      {data?.map((d, i) => {
        return (
          <>
            <CardBody>
              <Row>
                <Col>
                  <MiniTable
                    labelProps={{ md: '4' }}
                    valueProps={{ md: 7 }}
                    label={'agency-name'}
                    value={d?.name}
                  />
                  <MiniTable
                    labelProps={{ md: '4' }}
                    valueProps={{ md: 7 }}
                    label={'activity'}
                    value={d?.assigned_hours}
                  />

                  <MiniTable
                    labelProps={{ md: '4' }}
                    valueProps={{ md: 7 }}
                    label={'start-date'}
                    value={d?.start_date}
                  />
                </Col>
              </Row>
            </CardBody>
          </>
        )
      })}
    </Card>
  )
}

export default HoursAllow
