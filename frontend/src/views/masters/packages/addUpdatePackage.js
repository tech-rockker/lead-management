import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import { Col, Form, InputGroupText, Label } from 'reactstrap'
import { addPackage, editPackage } from '../../../utility/apis/packagesApis'
import { Patterns } from '../../../utility/Const'
import { FM, isValid } from '../../../utility/helpers/common'
import Show from '../../../utility/Show'
import {
  calculateDiscount,
  currencyFormat,
  isObjEmpty,
  SpaceTrim,
  timeConvert
} from '../../../utility/Utils'
import FormGroupCustom from '../../components/formGroupCustom'
import SideModal from '../../components/sideModal/sideModal'

const AddPackage = ({ show, handleModal, edit = null }) => {
  const dispatch = useDispatch()
  // Form Validation
  const {
    formState: { errors },
    handleSubmit,
    control,
    setValue,
    watch,
    reset
  } = useForm({
    defaultValues: {
      discount_type: edit?.discount_type ?? 2
    }
  })

  // States
  const [open, setOpen] = useState(show)
  const [loading, setLoading] = useState(false)

  // Show/Hide Modal
  useEffect(() => {
    if (show) setOpen(true)
  }, [show])

  useEffect(() => {
    if (edit && !isObjEmpty(edit)) {
    }
  }, [edit])

  useEffect(() => {
    if (watch('is_sms_enable') === 0) {
      setValue('sms_charges', '')
    }
  }, [watch('is_sms_enable')])

  useEffect(() => {
    if (watch('is_enable_bankid_charges') === 0) {
      setValue('bankid_charges', '')
    }
  }, [watch('is_enable_bankid_charges')])

  // useEffect(() => {
  //     if (watch("discount_type")) {
  //         setValue("discount_type", watch("discount_type"))
  //     }
  // }, [])
  // Save
  const handleSave = (jsonData) => {
    if (edit && !isObjEmpty(edit)) {
      editPackage({
        jsonData: {
          ...edit,
          ...jsonData
        },
        loading: setLoading,
        dispatch,
        success: () => {
          setOpen(false)
          handleModal(false)
          reset()
        }
      })
    } else {
      addPackage({
        jsonData: {
          ...jsonData
        },
        loading: setLoading,
        dispatch,
        success: () => {
          setOpen(false)
          handleModal(false)
          reset()
        }
      })
    }
  }

  return (
    <SideModal
      loading={loading}
      handleSave={handleSubmit(handleSave)}
      open={open}
      handleModal={() => {
        setOpen(false)
        handleModal(false)
        reset()
      }}
      title={edit ? 'edit-package' : 'create-new-package'}
      done='save'
    >
      <Form>
        <FormGroupCustom
          values={edit}
          label={'enter-name'}
          type={'text'}
          className='mb-1'
          name={'name'}
          errors={errors}
          control={control}
          rules={{
            required: true,
            validate: (v) => {
              return isValid(v) ? !SpaceTrim(v) : true
            }
          }}
        />
        <FormGroupCustom
          values={edit}
          type={'text'}
          name={'validity_in_days'}
          errors={errors}
          control={control}
          className='mb-1'
          rules={{
            required: true,
            pattern: Patterns.NumberOnlyNoDot,
            max: 365,
            min: 1,
            validate: (v) => {
              return isValid(v) ? !SpaceTrim(v) : true
            }
          }}
        />
        <FormGroupCustom
          values={edit}
          type={'text'}
          name={'number_of_patients'}
          errors={errors}
          className='mb-1'
          control={control}
          rules={{
            required: true,
            validate: (v) => {
              return isValid(v) ? !SpaceTrim(v) : true
            }
          }}
        />
        <FormGroupCustom
          values={edit}
          type={'text'}
          name={'number_of_employees'}
          errors={errors}
          className='mb-1'
          control={control}
          rules={{
            required: true,
            validate: (v) => {
              return isValid(v) ? !SpaceTrim(v) : true
            }
          }}
        />
        <FormGroupCustom
          values={edit}
          type={'text'}
          name={'price'}
          errors={errors}
          message={FM('price_message', { length: 9 })}
          feedback={FM('price_feedback', { length: 9 })}
          control={control}
          className='mb-1'
          rules={{
            required: true,
            pattern: Patterns.NumberOnly,
            maxLength: 9,
            min: 1,
            validate: (v) => {
              return isValid(v) ? !SpaceTrim(v) : true
            }
          }}
        />
        <Show IF={watch('price') > 0 || edit?.price > 0}>
          <FormGroupCustom
            values={edit}
            type={'checkbox'}
            name={'is_on_offer'}
            errors={errors}
            className='mb-1'
            control={control}
            onChangeValue={(e) => {
              if (!e) {
                setValue('discount_type', null)
                setValue('discount_value', null)
              }
            }}
            rules={{ required: false }}
          />
        </Show>
        <Show
          IF={
            (watch('is_on_offer') || edit?.is_on_offer) && (watch('price') > 0 || edit?.price > 0)
          }
        >
          <Label>{FM('discount-type')}</Label>
          <div className='d-flex'>
            <FormGroupCustom
              values={edit}
              type={'radio'}
              label={'flat-discount'}
              name={'discount_type'}
              value={2}
              errors={errors}
              defaultChecked={edit ? edit?.discount_type === '2' : true}
              setValue={setValue}
              className='mb-1'
              control={control}
              rules={{ required: true }}
            />
            <FormGroupCustom
              values={edit}
              type={'radio'}
              value={1}
              name={'discount_type'}
              errors={errors}
              defaultChecked={edit?.discount_type === '1'}
              label={'percent-discount'}
              className='mb-1 ms-2'
              setValue={setValue}
              control={control}
              rules={{ required: true }}
            />
          </div>
          <Show IF={watch('discount_type') || edit?.discount_type}>
            <FormGroupCustom
              values={edit}
              type={'text'}
              name={'discount_value'}
              errors={errors}
              message={
                watch('discount_type') === '1'
                  ? FM('discount_value_message')
                  : FM('discount_value_message_flat')
              }
              feedback={
                watch('discount_type') === '1'
                  ? FM('discount_value_feedback')
                  : FM('discount_value_feedback_flat')
              }
              control={control}
              rules={{
                required: true,
                pattern: Patterns.NumberOnly,
                maxLength: 5,
                min: 1,
                max: watch('discount_type') === '1' ? 99 : watch('price') - 1
              }}
            />
            <Show IF={watch('discount_value') > 0}>
              <p className='fw-bold text-dark mt-1'>
                {FM('price_after_discount')}:{' '}
                {watch('discount_type') === '1' ? (
                  calculateDiscount(watch('price'), watch('discount_value'))
                ) : (
                  <>{currencyFormat(watch('price') - watch('discount_value'))}</>
                )}
                <Show IF={watch('discount_value') > 0}>
                  <span className='text-danger'>
                    {' '}
                    (-
                    {watch('discount_value')}
                    <Show IF={watch('discount_type') === '1'}>%</Show>)
                  </span>
                </Show>
              </p>
            </Show>
          </Show>
        </Show>
        <Col md='12' xs='12' className='mt-1'>
          <FormGroupCustom
            prepend={
              <InputGroupText>
                <FormGroupCustom
                  noGroup
                  noLabel
                  tooltip={FM('sms-tooltip')}
                  values={edit}
                  type='checkbox'
                  name='is_sms_enable'
                  label={FM('is_sms_enable')}
                  className='mb-1'
                  errors={errors}
                  control={control}
                  rules={{ required: false }}
                />
              </InputGroupText>
            }
            values={watch('sms_charges') ?? edit}
            placeholder={FM('sms-charges')}
            type='number'
            refreshInput={watch('is_sms_enable') === 0}
            message={FM('sms-tooltip')}
            name='sms_charges'
            label={FM('is-sms-enable')}
            className='mb-1'
            disabled={!watch('is_sms_enable')}
            errors={errors}
            control={control}
            rules={{ required: watch('is_sms_enable'), min: 0.000001, max: 240 }}
          />
        </Col>

        <Col md='12' xs='12'>
          <FormGroupCustom
            prepend={
              <InputGroupText>
                <FormGroupCustom
                  noGroup
                  noLabel
                  tooltip={FM('sms-tooltip')}
                  values={edit}
                  type='checkbox'
                  name='is_enable_bankid_charges'
                  label={FM('is_enable_bankid_charges')}
                  className='mb-1'
                  errors={errors}
                  control={control}
                  rules={{ required: false }}
                />
              </InputGroupText>
            }
            values={watch('bankid_charges') ?? edit}
            placeholder={FM('bankid-charges')}
            type='number'
            refreshInput={watch('is_enable_bankid_charges') === 0}
            message={FM('sms-tooltip')}
            name='bankid_charges'
            label={FM('is-enable-bankid')}
            className='mb-1'
            disabled={!watch('is_enable_bankid_charges')}
            errors={errors}
            control={control}
            rules={{ required: watch('is_enable_bankid_charges'), min: 0.000001, max: 240 }}
          />
        </Col>

        {/* <FormGroupCustom
                    values={edit}
                    type={"text"}
                    name={"bankid_charges"}
                    errors={errors}
                    message={FM("price_message", { length: 9 })}
                    feedback={FM("price_feedback", { length: 9 })}
                    control={control}
                    className='mb-1'
                    rules={{ required: true, pattern: Patterns.NumberOnly, maxLength: 9, min: 1 }}
                /> */}
      </Form>
    </SideModal>
  )
}

export default AddPackage
