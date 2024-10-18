import React, { useEffect, useState } from 'react'
import SlideDown from 'react-slidedown'
import { Col, Form, Row } from 'reactstrap'
import { countryListLoad } from '../../../utility/apis/commons'
import { Patterns } from '../../../utility/Const'
import { FM, isValid, isValidArray, log } from '../../../utility/helpers/common'
import Show from '../../../utility/Show'
import { createSelectOptions, getAge, SpaceTrim } from '../../../utility/Utils'
import FormGroupCustom from '../../components/formGroupCustom'

const PersonsForm = ({
  personsCard,
  fromIp = false,
  index = 0,
  requiredEnabled = false,
  watch,
  setValue,
  edit,
  onSubmit,
  control,
  errors
}) => {
  //country
  const [country, setCountry] = useState([])
  const [countryLoading, setCountryLoading] = useState(false)
  const [defaultCountry, setDefaultCountry] = useState(null)

  //Countries
  const loadCountries = () => {
    countryListLoad({
      loading: setCountryLoading,
      success: (d) => {
        setCountry(createSelectOptions(d?.payload, 'name', 'id'))
        setDefaultCountry(d?.payload?.find((a) => a.name === 'Sweden')?.id)
      }
    })
  }

  useEffect(() => {
    loadCountries()
  }, [])

  useEffect(() => {
    setValue(
      `persons.${index}.country_name`,
      country?.find((a) => a.value === edit?.country_id)?.label
    )
  }, [edit?.country_id])

  useEffect(() => {
    setValue(`persons.${index}.country_id`, edit?.country?.id)
  }, [edit])

  useEffect(() => {
    if (!isValid(edit?.id)) {
      setValue(`persons.${index}.is_family_member`, 1)
    } else {
      setValue(`persons.${index}.is_family_member`, edit?.is_family_member)
    }
  }, [edit])

  useEffect(() => {
    setValue(`persons.${index}.country_id`, defaultCountry)
  }, [defaultCountry])

  const findErrors = (name) => {
    let x = false
    if (errors && errors?.persons && errors?.persons[index]) {
      const a = errors?.persons[index]
      x = a?.hasOwnProperty(name)
    }
    return x
  }

  useEffect(() => {
    setValue(`persons.${index}.is_presented`, watch(`persons.${index}.is_participated`))
    if (!watch(`persons.${index}.is_participated`)) {
      watch(`persons.${index}.is_participated`)
    }
  }, [watch(`persons.${index}.is_participated`)])

  useEffect(() => {
    if (isValid(watch(`persons.${index}.pn`))) {
      setValue(
        `persons.${index}.personal_number`,
        String(watch(`persons.${index}.pn`)).replaceAll('-', '')
      )
    }
  }, [watch(`persons.${index}.pn`)])

  useEffect(() => {
    if (isValid(edit?.personal_number)) {
      setValue(`persons.${index}.pn`, edit?.personal_number)
    }
  }, [edit?.personal_number])

  useEffect(() => {
    if (!watch(`persons.${index}.is_presented`)) {
      setValue(`persons.${index}.is_participated`, false)
      setValue(`persons.${index}.how_helped`, '')
    }
  }, [watch(`persons.${index}.is_presented`)])

  const options = { delimiters: ['-'], blocks: [8, 4] }

  if (isValid(index)) {
    return (
      <div>
        <Form onSubmit={onSubmit}>
          <div className='content-header mb-1'>
            <h5 className='mb-0'>{FM('personal-info')}</h5>
            <small>{FM('enter-personal-info')}</small>
          </div>
          <Row>
            <Col md='4'>
              <FormGroupCustom
                noLabel
                name={`persons[${index}].id`}
                type={'hidden'}
                className=''
                control={control}
                rules={{ required: false }}
                value={edit?.id}
              />
              <FormGroupCustom
                name={`persons.${index}.name`}
                // key={`persons.${index}.name`}
                label={FM('name')}
                type={'text'}
                error={findErrors('name')}
                className='mb-2'
                control={control}
                rules={{
                  required: true,
                  validate: (v) => {
                    return isValid(v) ? !SpaceTrim(v) : true
                  }
                }}
                value={edit?.name}
              />
            </Col>
            <Col md='4'>
              <FormGroupCustom
                name={`persons.${index}.email`}
                label={FM('email')}
                type={'email'}
                error={findErrors('email')}
                // key={`persons.${index}.email`}
                className='mb-2'
                control={control}
                rules={{
                  required: true,
                  pattern: Patterns.EmailOnly,
                  validate: (value) => {
                    log(value, 'Value')
                    if (isValidArray(personsCard) || isValid(edit)) {
                      if (
                        value !== personsCard?.find((d) => d?.email)?.email ||
                        value === edit?.email
                      ) {
                        return true
                      } else {
                        return false
                      }
                    } else {
                      return false
                    }
                  }
                }}
                value={edit?.email}
              />
            </Col>
            <Col md='4'>
              <FormGroupCustom
                name={`persons.${index}.contact_number`}
                label={FM('contact-number')}
                type={'text'}
                error={findErrors('contact_number')}
                className='mb-2'
                control={control}
                rules={{ required: false, maxLength: 12 }}
                value={edit?.contact_number}
              />
            </Col>
            <Col md='4'>
              <FormGroupCustom
                name={`persons.${index}.pn`}
                label={FM('personal-number')}
                type={'mask'}
                maskOptions={options}
                error={findErrors('pn')}
                className='mb-2'
                control={control}
                rules={{
                  required: false
                  // minLength: "13",
                  // validate: (v) => {
                  //     return isValid(v) ? getAge(v, FM, true) : true && String(v).replaceAll("-", "").length === 12
                  // }
                }}
                placeholder='YYYYMMDD-XXXX'
                value={edit?.personal_number}
              />
            </Col>

            <Col md='8'>
              <FormGroupCustom
                name={`persons.${index}.full_address`}
                label={FM('address')}
                type={'text'}
                error={findErrors('full_address')}
                className='mb-2'
                control={control}
                rules={{ required: false }}
                value={edit?.full_address}
              />
            </Col>
            {/* <Col md="4">
                        <FormGroupCustom
                            label={FM("country")}
                            options={country}
                            name={`persons.${index}.country_id`}
                            type={"select"}
                            className="mb-2"
                            isDisabled={countryLoading}
                            isLoading={countryLoading}
                            control={control}
                            rules={{ required: false }}
                            error={findErrors('country_id')}
                            value={defaultCountry ?? edit?.country_id}
                        />

                        <FormGroupCustom
                            noGroup
                            noLabel
                            type={"hidden"}
                            control={control}
                            error={findErrors('country_name')}
                            name={`persons.${index}.country_name`}
                            className="d-none"
                            value={edit?.country_name}
                            rules={{ required: false }}
                        />
                    </Col> */}
            <Col md='4'>
              <FormGroupCustom
                name={`persons.${index}.city`}
                label={FM('city')}
                type={'text'}
                error={findErrors('city')}
                className='mb-2'
                control={control}
                rules={{ required: false }}
                value={edit?.city}
              />
            </Col>
            <Col md='4'>
              <FormGroupCustom
                name={`persons.${index}.postal_area`}
                label={FM('postal-area')}
                type={'text'}
                error={findErrors('postal_area')}
                className='mb-2'
                control={control}
                rules={{ required: false }}
                value={edit?.postal_area}
              />
            </Col>
            <Col md='4'>
              <FormGroupCustom
                name={`persons.${index}.zipcode`}
                label={FM('postal-code')}
                type={'number'}
                error={findErrors('zipcode')}
                className='mb-2'
                control={control}
                rules={{ required: false, minLength: 5, maxLength: 5 }}
                value={edit?.zipcode}
              />
            </Col>
          </Row>
          <div className='content-header mt-1 mb-1'>
            <h5 className='mb-0'>{FM('person-type')}</h5>
            <small>{FM('please-select-person-type')}</small>
          </div>
          <Row>
            <Col md='2'>
              <FormGroupCustom
                name={`persons.${index}.is_family_member`}
                type={'checkbox'}
                label={'is-family-member'}
                classNameLabel={'w-100'}
                error={findErrors('is_family_member')}
                className='mb-2'
                control={control}
                onChangeValue={(e) => {
                  log(e)
                  setValue(`persons.${index}.is_family_member`, e === true ? 1 : 0)
                }}
                checked={watch(`persons.${index}.is_family_member`) === 1}
                forceValue
                value={watch(`persons.${index}.is_family_member`) === 1}
              />
            </Col>
            <Col md='2'>
              <FormGroupCustom
                name={`persons.${index}.is_contact_person`}
                type={'checkbox'}
                label={'is-contact-person'}
                classNameLabel={'w-100'}
                error={findErrors('is_contact_person')}
                className='mb-2'
                control={control}
                value={edit?.is_contact_person}
              />
            </Col>
            <Col md='2'>
              <FormGroupCustom
                name={`persons.${index}.is_caretaker`}
                type={'checkbox'}
                label={'is-caretaker'}
                error={findErrors('is_caretaker')}
                classNameLabel={'w-100'}
                className='mb-2'
                control={control}
                value={edit?.is_caretaker}
              />
            </Col>
            <Col md='2'>
              <FormGroupCustom
                name={`persons.${index}.is_guardian`}
                type={'checkbox'}
                label={'is-guardian'}
                error={findErrors('is_guardian')}
                classNameLabel={'w-100'}
                className='mb-2'
                control={control}
                value={edit?.is_guardian}
              />
            </Col>
            <Col md='2'>
              <FormGroupCustom
                name={`persons.${index}.is_other`}
                type={'checkbox'}
                label={'is-other'}
                error={findErrors('is_other')}
                classNameLabel={'w-100'}
                className='mb-2'
                control={control}
                value={edit?.is_other}
              />
            </Col>
          </Row>
          <Show IF={watch(`persons.${index}.is_other`)}>
            <FormGroupCustom
              name={`persons.${index}.is_other_name`}
              type={'text'}
              label={'title'}
              error={findErrors('is_other_name')}
              classNameLabel={'w-100'}
              className='mb-2'
              control={control}
              value={edit?.is_other_name}
            />
          </Show>
          {/* <Show IF={fromIp}>
                        <div className='content-header mt-1 mb-1'>
                            <h5 className='mb-0'>{FM("present-participated")}</h5>
                            <small>{FM("present-participated-details")}</small>
                        </div>
                        <Row>
                            <Col md="3">
                                <FormGroupCustom
                                    name={`persons.${index}.is_presented`}
                                    type={"checkbox"}
                                    label={"presented"}
                                    error={findErrors('is_presented')}
                                    classNameLabel={"w-100"}
                                    className="mb-2"
                                    control={control}
                                    value={watch(`persons.${index}.is_participated`) || edit?.presented} />
                            </Col>
                            <Col md="3">
                                <FormGroupCustom
                                    name={`persons.${index}.is_participated`}
                                    type={"checkbox"}
                                    label={"participated"}
                                    error={findErrors('is_participated')}
                                    classNameLabel={"w-100"}
                                    className="mb-2"
                                    control={control}
                                    value={edit?.is_participated} />
                            </Col>
                            <Show IF={watch(`persons.${index}.is_participated`)}>
                                <SlideDown>
                                    <Col md="12">
                                        <FormGroupCustom
                                            name={`persons.${index}.how_helped`}
                                            label={FM("how-participated")}
                                            type={"textarea"}
                                            error={findErrors('how_helped')}
                                            className="mb-2"
                                            control={control}
                                            rules={{ required: requiredEnabled }}
                                            value={edit?.how_helped} />
                                    </Col>
                                </SlideDown>
                            </Show>
                        </Row>
                    </Show> */}
        </Form>
      </div>
    )
  } else {
    return null
  }
}

export default PersonsForm
