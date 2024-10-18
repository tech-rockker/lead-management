import React, { isValidElement, useContext, useEffect, useState } from 'react'

import { ThemeColors } from '@src/utility/context/ThemeColors'
import { Bar } from 'react-chartjs-2'
import { CardBody, Card, Row, Col, ButtonGroup } from 'reactstrap'
import { useForm } from 'react-hook-form'
import { loadUser } from '../../../../utility/apis/userManagement'

import {
  createAsyncSelectOptions,
  createConstSelectOptions,
  createSelectOptions,
  decryptObject
} from '../../../../utility/Utils'
import { FM, isValid, isValidArray, log } from '../../../../utility/helpers/common'
import Header from '../../../header'
import FormGroupCustom from '../../../components/formGroupCustom'
import { loadScReports } from '../../../../utility/apis/schedule'
import { LogarithmicScale } from 'chart.js'
import { companyTypes, forDecryption, UserTypes } from '../../../../utility/Const'
import { Download } from 'react-feather'
import BsTooltip from '../../../components/tooltip'
import { employeeHoursExport } from '../../../../utility/apis/employeeApproval'
import useUser from '../../../../utility/hooks/useUser'
import Hide from '../../../../utility/Hide'

// import FormGroupCustom from '../../components/formGroupCustom'
// import { FM } from '../../../utility/helpers/common'
// import { useForm } from 'react-hook-form'
// import { loadUser } from '../../../utility/apis/userManagement'
// import { UserTypes } from '../../../utility/Const'
// import { createAsyncSelectOptions } from '../../../utility/Utils'
// import Header from '../../header'

const StatsWithEmployee = () => {
  const [emp, setEmp] = useState([])
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(false)
  const [ids, setIds] = useState([])
  const user = useUser()
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
    getValues,
    setError
  } = useForm()
  const { colors } = useContext(ThemeColors)
  //const labels = Utils.months({count: 7});

  const loadEMpOptions = () => {
    loadUser({
      loading: setLoading,

      jsonData: { user_type_id: UserTypes.employee },
      success: (e) => {
        log(e?.payload)
        setEmp(
          createSelectOptions(e?.payload, 'name', 'id', (x) => {
            return decryptObject(forDecryption, x)
          })
        )
      }
    })

    // return createAsyncSelectOptions(res, page, "name", "id", setEmp)
  }

  useEffect(() => {
    loadEMpOptions()
  }, [])
  const exportData = () => {
    employeeHoursExport()
  }
  const loadScheduleReports = () => {
    loadScReports({
      jsonData: {
        user_ids: isValidArray(watch('user_ids')) ? watch('user_ids') : []
      },
      loading: setLoading,
      success: (e) => {
        setReports(e?.payload)
      }
    })
  }

  // useEffect(() => {
  //     loadScheduleReports()
  // }, [])

  useEffect(() => {
    loadScheduleReports()
  }, [watch('user_ids')])

  //log(watch("user_ids"))

  const vocationFilter = isValidArray(reports?.vacation_hours)
    ? reports?.vacation_hours.filter((d) => d >= 0)
    : []
  const obeFilter = isValidArray(reports?.obe_hours) ? reports?.obe_hours.filter((d) => d > 0) : []
  const regularFilter = isValidArray(reports?.regular_hours)
    ? reports?.regular_hours.filter((d) => d >= 0)
    : []
  const totalFilter = isValidArray(reports?.total_hours)
    ? reports?.total_hours.filter((d) => d >= 0)
    : []
  const emergencyFilter = isValidArray(reports?.emergency_hours)
    ? reports?.emergency_hours.filter((d) => d >= 0)
    : []
  const extraFilter = isValidArray(reports?.extra_hours)
    ? reports?.extra_hours.filter((d) => d >= 0)
    : []
  const data = {
    labels: reports?.labels,
    datasets: [
      {
        label: FM('obe-hours'),
        data: obeFilter,
        backgroundColor: colors.secondary.main,
        stack: 'Stack 0'
      },
      {
        label: FM('vocation-hours'),
        data: vocationFilter,
        backgroundColor: colors.success.main,
        stack: 'Stack 0'
      },
      {
        label: FM('regular-hour'),
        data: regularFilter,
        backgroundColor: colors.primary.main,
        stack: 'Stack 0'
      },

      // {
      //     label: FM('total-hours'),
      //     data: totalFilter,
      //     backgroundColor: colors.info.main,
      //     stack: 'Stack 0'
      // },
      {
        label: FM('emergency-hours'),
        data: emergencyFilter,
        backgroundColor: colors.warning.main,
        stack: 'Stack 0'
      },
      {
        label: FM('extra-hours'),
        data: extraFilter,
        backgroundColor: colors.danger.main,
        stack: 'Stack 0'
      }
    ]
  }

  const config = {
    type: 'bar',
    data,
    options: {
      plugins: {
        title: {
          display: false,
          text: FM('reports-with-employee')
        }
      },
      responsive: true,
      interaction: {
        mode: 'index',
        intersect: false
      },
      scales: {
        x: {
          stacked: true
        },
        y: {
          stacked: true
        }
      }
    }
  }
  return (
    <>
      <div>
        <Card className=''>
          <CardBody>
            <Header title={FM('report-employee')} className='m-0'>
              {/* <BsTooltip size="sm" color="success" title={"export"} onClick={exportData} className='btn btn-primary btn-sm m-1' role={"button"}>
                            <Download size={15} />
                        </BsTooltip> */}
            </Header>

            <Row>
              <Col md={12} className='m-0'>
                <FormGroupCustom
                  noGroup
                  noLabel
                  key={`fjdfd`}
                  label={FM('employees')}
                  placeholder={FM('select-employee')}
                  type={'select'}
                  isMulti
                  isClearable
                  control={control}
                  loadOptions={loadEMpOptions}
                  rules={{ required: false }}
                  errors={errors}
                  options={emp}
                  name={'user_ids'}
                  className='mb-0'
                />
              </Col>
              <Col md={12} className='m-2'>
                <Bar data={data} {...config} />
              </Col>
            </Row>
          </CardBody>
        </Card>
      </div>
    </>
  )
}

export default StatsWithEmployee
