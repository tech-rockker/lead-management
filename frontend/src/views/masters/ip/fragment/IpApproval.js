import React, { useEffect, useRef, useState } from 'react'
import { Button, Input, Spinner, Table } from 'reactstrap'
import { CategoryType } from '../../../../utility/Const'
import Emitter from '../../../../utility/Emitter'
import Hide from '../../../../utility/Hide'
import Show from '../../../../utility/Show'
import {
  ErrorToast,
  JsonParseValidate,
  SuccessToast,
  decrypt,
  renderPersonType,
  toggleArray
} from '../../../../utility/Utils'
import { personApprovalAdd } from '../../../../utility/apis/userManagement'
import { FM, isValid, isValidArray, log } from '../../../../utility/helpers/common'
import usePackage from '../../../../utility/hooks/usePackage'
import FormGroupCustom from '../../../components/formGroupCustom'

const IpApproval = ({
  noComment = false,
  justList = false,
  setSelectedPersons = () => {},
  isSaved = false,
  ip = null,
  setTriggerApprove = () => {},
  triggerApprove = null,
  handleSaveForce = () => {},
  noApproval = false,
  setValue = () => {},
  watch = () => {},
  errors,
  control,
  edit,
  ipId
}) => {
  const [persons, setPersons] = useState([])
  const [selected, setSelected] = useState([])
  const [waiting, setWaiting] = useState([])
  const [approved, setApproved] = useState(
    localStorage.getItem('waitingForResponse')
      ? JsonParseValidate(localStorage.getItem('waitingForResponse'), [])
      : []
  )
  const [loading, setLoading] = useState(false)
  const [disable, setDisable] = useState(false)
  const hiddenDiv = useRef()
  const pack = usePackage()

  useEffect(() => {
    if (edit !== null) {
      if (isValidArray(edit)) {
        setPersons(edit)
      }
    }
  }, [edit, watch('r_type')])

  useEffect(() => {
    log('waiting changed', waiting)
    localStorage.setItem('waitingForResponse', JSON.stringify(waiting))
  }, [waiting])

  const toggleSelected = (v) => {
    toggleArray(v, selected, setSelected)
  }
  const toggleApproved = (v) => {
    toggleArray(v, approved, setApproved)
  }
  const toggleWaiting = (v, remove = false) => {
    const index = waiting?.findIndex((e) => e === v)
    log('waiting', waiting)
    const finalArray = [...waiting]
    log('finalArray start', finalArray)
    if (index === -1) {
      finalArray?.push(v)
    } else {
      if (remove) {
        log('index', index)
        finalArray?.splice(index, 1)
      }
    }
    log('finalArray end', finalArray)

    setWaiting([...finalArray])
  }
  const checkAll = (e) => {
    const r = []
    persons?.forEach((d, i) => {
      if (!approved?.includes(d?.id) || !waiting?.includes(d?.id)) {
        r.push(d?.id)
      }
    })
    if (e) {
      setSelected(r)
    } else {
      setSelected([])
    }
  }

  const filterPerson = () => {
    const r = []
    persons?.forEach((d, i) => {
      if (isValid(d?.personal_number)) {
        r.push(d)
      }
    })
    setPersons(r)
  }

  const resetFilter = () => {
    setPersons(edit)
  }

  useEffect(() => {
    if (watch('r_type') === '2') {
      Emitter.on('IP-approval', (e) => {
        log('echoEventIPApproval', e)
        log('success waiting', waiting)
        log('persons waiting', persons)
        if (e?.error) {
          const getId = persons?.find((a) => a.personal_number === e?.pnr)?.id
          toggleWaiting(getId, true)
        } else {
          toggleApproved(e?.data?.sender_id)
          // toggleSelected(e?.data?.sender_id)
          toggleWaiting(e?.data?.sender_id, true)
        }
      })
    }
  }, [watch('r_type'), waiting])

  const handleBank = (list) => {
    log('bank list', list)
    if (isValidArray(list)) {
      list.forEach((l, i) => {
        if (l?.error === 0) {
          toggleSelected(l?.person_id)
          toggleWaiting(l?.person_id)

          // const newWindow = window.open(l?.response?.redirectUrl, undefined)
          const iframe = document.createElement('iframe')
          // iframe.style.display = "none"
          iframe.src = l?.response?.redirectUrl
          hiddenDiv?.current?.appendChild(iframe)
        } else {
          ErrorToast(`${decrypt(l?.personnel_number)} - ${l?.response?.errorObject?.message}`)
        }
      })
    }
  }

  const saveReq = (ipId) => {
    personApprovalAdd({
      jsonData: {
        approval_type: watch('r_type'),
        request_type: CategoryType?.implementation,
        request_type_id: ipId ?? '',
        requested_to: selected ?? '',
        reason_for_requesting: 'Implementation Plan Approval'
      },
      loading: setLoading,
      success: (e) => {
        setTriggerApprove(null)
        // console.log(e?.payload)
        if (watch('r_type') === '1') {
          const w = window.open(e?.payload, '')
          w.blur()
          window.focus()
          SuccessToast(e?.message)
        } else if (watch('r_type') === '2') {
          handleBank(e?.payload)
        } else {
          SuccessToast(e?.message)
        }
      }
    })
  }

  useEffect(() => {
    setSelectedPersons(selected)
  }, [selected])

  const handleSubmit = (ipIds = null) => {
    if (isValid(ipId)) {
      saveReq([ipId])
    } else if (isValidArray(ipIds)) {
      saveReq(ipIds)
    } else {
      if (isSaved === 0) {
        handleSaveForce()
      }
    }
  }

  log('persons', edit)
  log('approval', approved)

  useEffect(() => {
    return () => {
      localStorage.removeItem('waitingForResponse')
    }
  }, [])

  useEffect(() => {
    if (triggerApprove === true) {
      handleSubmit(ip?.map((a) => a?.id))
    }
  }, [triggerApprove])

  // const renderPersons = () => {
  //     const re = []
  //     if (persons?.length > 0) {
  //         persons?.forEach((d, i) => {
  //             re.push(

  //             )
  //         })
  //     }
  //     return re
  // }

  const renderPersons = () => {
    const resp = edit?.map((d, i) => {
      return (
        <>
          <tr
            //  onClick={() => {
            //     if (!(justList || approved?.includes(d?.id) || waiting?.includes(d?.id))) {
            //         toggleSelected(d?.id)
            //     }
            // }}
            key={`p-${i}`}
            className={approved?.includes(d?.id) ? 'bg-light-success' : ''}
          >
            <Hide IF={justList || approved?.includes(d?.id) || waiting?.includes(d?.id)}>
              <td style={{ width: 20 }}>
                <FormGroupCustom
                  noGroup
                  noLabel
                  type={'checkbox'}
                  control={control}
                  errors={errors}
                  onChangeValue={(e) => {
                    toggleSelected(d?.id)
                  }}
                  name={'selected'}
                  value={selected?.includes(d?.id) ? 1 : 0}
                  rules={{ required: false }}
                />
              </td>
            </Hide>
            <Show IF={approved?.includes(d?.id)}>
              <td style={{ width: 20 }}>
                <span className='form-check-success'>
                  <Input type='checkbox' checked />
                </span>
              </td>
            </Show>
            <Show IF={waiting?.includes(d?.id) && !approved?.includes(d?.id)}>
              <td style={{ width: 20 }}>
                <Spinner size='sm' color='primary' />
              </td>
            </Show>
            <td>{d?.name}</td>
            {/* <Hide IF={noApproval}> */}

            <td>{d?.email}</td>
            <td>{d?.contact_number}</td>

            <td>{d?.personal_number}</td>
            {/* </Hide> */}
            <td>{renderPersonType(d)}</td>
          </tr>
        </>
      )
    })

    return resp
  }

  const forHandelSubmit = () => {
    handleSubmit(ip ? ip?.map((a) => a?.id) : ipId)
    setDisable(true)
    // if (selected?.length <= 0 && (watch("r_type") !== "1" || watch("r_type") !== "2" || watch("r_type") !== "3")) {
    // } setDisable(true)
  }
  // const disablereason = () => {
  //     if (selected?.length <= 0 && (watch("r_type") !== "1" || watch("r_type") !== "2" || watch("r_type") !== "3")) {
  //     } setDisable(false)
  // }

  return (
    <div>
      <Show IF={watch('user_id')}>
        <Hide IF={noApproval}>
          <div className='d-flex align-items-center justify-content-start mb-2'>
            <FormGroupCustom
              type={'radio'}
              label={FM('by-manual')}
              control={control}
              errors={errors}
              setValue={setValue}
              value='1'
              defaultChecked={watch('r_type') === '1'}
              onChangeValue={() => {
                resetFilter()
              }}
              name={'r_type'}
              className='me-2'
              rules={{ required: false }}
            />
            <Show IF={pack?.is_enable_bankid_charges === 1}>
              <FormGroupCustom
                type={'radio'}
                label={FM('by-mobile-bank-id')}
                control={control}
                errors={errors}
                defaultChecked={watch('r_type') === '2'}
                name={'r_type'}
                onChangeValue={() => {
                  filterPerson()
                }}
                setValue={setValue}
                value='2'
                className='me-2'
                rules={{ required: false }}
              />
            </Show>
            <FormGroupCustom
              type={'radio'}
              label={FM('by-digital-signature')}
              control={control}
              errors={errors}
              defaultChecked={watch('r_type') === '3'}
              setValue={setValue}
              value='3'
              onChangeValue={() => {
                resetFilter()
              }}
              className='me-2'
              name={'r_type'}
              rules={{ required: false }}
            />
          </div>
        </Hide>
        <Table>
          <thead>
            <tr>
              <Hide IF={justList}>
                <th>
                  <FormGroupCustom
                    noGroup
                    noLabel
                    type={'checkbox'}
                    control={control}
                    onChangeValue={(e) => {
                      checkAll(e)
                    }}
                    errors={errors}
                    name={'persons'}
                    value={persons?.length ? (selected?.length === persons?.length ? 1 : 0) : 0}
                    rules={{ required: false }}
                  />
                </th>
              </Hide>
              <th>{FM('name')}</th>
              <Hide IF={noApproval}>
                <th>{FM('email')}</th>
                <th>{FM('phone')}</th>
                <th>{FM('personal-number')}</th>
              </Hide>
              <th>{FM('type')}</th>
            </tr>
          </thead>
          <tbody key={`${persons?.length}-121`}>
            {/* {renderPersons()} */}
            {persons?.map((d, i) => {
              return (
                <>
                  <tr
                    //  onClick={() => {
                    //     if (!(justList || approved?.includes(d?.id) || waiting?.includes(d?.id))) {
                    //         toggleSelected(d?.id)
                    //     }
                    // }}
                    key={`p-${i}`}
                    className={approved?.includes(d?.id) ? 'bg-light-success' : ''}
                  >
                    <Hide IF={justList || approved?.includes(d?.id) || waiting?.includes(d?.id)}>
                      <td style={{ width: 20 }}>
                        <FormGroupCustom
                          noGroup
                          noLabel
                          type={'checkbox'}
                          control={control}
                          errors={errors}
                          onChangeValue={(e) => {
                            toggleSelected(d?.id)
                          }}
                          name={'selected'}
                          value={selected?.includes(d?.id) ? 1 : 0}
                          rules={{ required: false }}
                        />
                      </td>
                    </Hide>
                    <Show IF={approved?.includes(d?.id)}>
                      <td style={{ width: 20 }}>
                        <span className='form-check-success'>
                          <Input type='checkbox' checked />
                        </span>
                      </td>
                    </Show>
                    <Show IF={waiting?.includes(d?.id) && !approved?.includes(d?.id)}>
                      <td style={{ width: 20 }}>
                        <Spinner size='sm' color='primary' />
                      </td>
                    </Show>
                    <td>{d?.name}</td>
                    <Hide IF={noApproval}>
                      <td>{d?.email}</td>
                      <td>{d?.contact_number}</td>

                      <td>{d?.personal_number}</td>
                    </Hide>
                    <td>{renderPersonType(d)}</td>
                  </tr>
                </>
              )
            })}
          </tbody>
        </Table>
        <div ref={hiddenDiv}></div>
        <Hide IF={noComment}>
          <FormGroupCustom
            style={{ minHeight: 100 }}
            label={FM('comment')}
            name={`approval_comment`}
            value={edit?.body_functions}
            type={'autocomplete'}
            errors={errors}
            className='mb-2'
            control={control}
            rules={{ required: false }}
          />
        </Hide>
        <Hide IF={noApproval || justList}>
          <div className='d-flex align-items-center justify-content-start'>
            {/* <Button disabled={selected?.length <= 0 && (watch("r_type") !== "1" || watch("r_type") !== "2" || watch("r_type") !== "3")} onClick={e => {
                            handleSubmit(ip ? ip?.map(a => a?.id) : ipId)
                        }} size='' color='primary'>
                            {loading ? <Spinner size="sm" /> : FM("send-request")}
                        </Button> */}
            <Show IF={selected?.length > 0 && isValid(watch('r_type'))}>
              <Button
                onClick={(e) => {
                  forHandelSubmit()
                }}
                size=''
                color='primary'
              >
                {loading ? <Spinner size='sm' /> : FM('send-request')}
              </Button>
            </Show>
          </div>
        </Hide>
      </Show>
    </div>
  )
}

export default IpApproval
