import React from 'react'
import { Mail, MapPin, PhoneCall, User } from 'react-feather'
import { Card, CardBody, CardHeader, Col, Label, Row } from 'reactstrap'
import { forDecryption } from '../../../../../utility/Const'
import { FM, isValidArray } from '../../../../../utility/helpers/common'
import { decryptObject, renderPersonType } from '../../../../../utility/Utils'
import MiniTable from '../../../../components/tableGrid/miniTable'
import Show from '../../../../../utility/Show'

const ConnectedPerson = ({ ip }) => {
  const renderPersonTypes = (p) => {
    let re = ''
    if (p?.user?.is_family_member) {
      re += `${FM('is-family-member')}, `
    }
    if (p?.user?.is_contact_person) {
      re += `${FM('is-contact-person')}, `
    }
    if (p?.user?.is_caretaker) {
      re += `${FM('is-caretaker')}, `
    }
    if (p?.user?.is_guardian) {
      re += `${FM('is-guardian')}, `
    }
    if (p?.user?.is_other) {
      re += p?.user?.is_other_name
    }
    return re
  }

  return (
    <Row className='m-1'>
      {ip?.persons?.map((c, i) => {
        const p = { ...c, user: decryptObject(forDecryption, c?.user) }
        if (p?.is_participated === 1 || p?.is_presented === 1) {
          return (
            <>
              <Col md='6' className='mb-0'>
                <Card className='mt-0'>
                  <CardHeader className='pb-1 pt-1'>
                    <Row className='align-items-center flex-1'>
                      <Col xs='8'>
                        <h5 className='mb-0 fw-bold text-primary'>{`${FM('person')} ${i + 1}`}</h5>
                        <p className='text-muted text-small-12 mb-0'>{renderPersonTypes(p)} </p>
                      </Col>
                    </Row>
                  </CardHeader>
                  <CardBody>
                    <MiniTable
                      rowProps={{ className: 'mb-5px' }}
                      separatorProps={{ className: 'd-none' }}
                      labelProps={{ md: 1 }}
                      valueProps={{ md: 11 }}
                      icon={<User size={16} />}
                      value={p?.user?.name}
                    />
                    <MiniTable
                      rowProps={{ className: 'mb-5px' }}
                      separatorProps={{ className: 'd-none' }}
                      labelProps={{ md: 1 }}
                      valueProps={{ md: 11 }}
                      icon={<Mail size={16} />}
                      value={p?.user?.email}
                    />
                    <MiniTable
                      rowProps={{ className: 'mb-5px' }}
                      separatorProps={{ className: 'd-none' }}
                      labelProps={{ md: 1 }}
                      valueProps={{ md: 11 }}
                      icon={<PhoneCall size={16} />}
                      value={p?.user?.contact_number}
                    />
                    {/* <MiniTable rowProps={{ className: "mb-5px" }} separatorProps={{ className: "d-none" }} labelProps={{ md: 1 }} valueProps={{ md: 11 }} icon={<MapPin size={16} />} value={`${p?.user?.full_address ?? ''} ${p?.user?.city ?? ''} ${p?.user?.country_name ?? ''} ${p?.user?.postal_area ?? ''} ${p?.user?.zipcode ?? ''}`} /> */}
                    <p className='text-danger text-small-12 mb-2 mt-1 fw-bold'>
                      {p?.is_presented ? <>{FM('presented')}</> : ''}
                      {p?.is_participated ? (
                        <>
                          {' '}
                          {FM('and')} {FM('participated')}
                        </>
                      ) : (
                        ''
                      )}
                    </p>
                    {p?.how_helped ? (
                      <>
                        <Label className='fw-bolder'>{FM('how-participated')}</Label>
                        <p>{p?.how_helped}</p>
                      </>
                    ) : null}
                  </CardBody>
                </Card>
              </Col>
            </>
          )
        }
      })}
    </Row>
  )
}

export default ConnectedPerson
