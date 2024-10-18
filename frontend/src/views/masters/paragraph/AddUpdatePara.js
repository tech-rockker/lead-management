import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { Form } from 'reactstrap'
import { addParagraph, editParagraph, loadParagraph } from '../../../utility/apis/paragraph'
import { FM, isValid, log } from '../../../utility/helpers/common'
import { isObjEmpty } from '../../../utility/Utils'
import BadWordsFilter from '../../components/badWords'
import FormGroupCustom from '../../components/formGroupCustom'
import Profanity from '../../components/profanity'
import SideModal from '../../components/sideModal/sideModal'

const AddUpdatePara = ({ show, handleModal, edit = null }) => {
  // Dispatch
  const dispatch = useDispatch()

  // Form Validation
  const {
    register,
    formState: { errors },
    handleSubmit,
    control,
    getValues,
    watch,
    reset,
    setValue
  } = useForm()
  const history = useHistory() // States

  const [open, setOpen] = useState(show)

  const [loading, setLoading] = useState(false)

  // Category Options

  // Show/Hide Modal
  useEffect(() => {
    if (show) setOpen(true)
    if (!show) reset()
  }, [show])

  // Save paragraph
  const handleSave = (data) => {
    if (edit && !isObjEmpty(edit)) {
      editParagraph({
        jsonData: {
          ...edit,
          ...data
        },
        id: edit?.id,
        loading: setLoading,
        dispatch,
        success: () => {
          setOpen(false)
          handleModal(false)
          loadParagraph({
            perPage: 10000,
            dispatch
          })
        }
      })
    } else {
      log(data)
      addParagraph({
        jsonData: {
          ...data
        },
        loading: setLoading,
        dispatch,
        success: () => {
          loadParagraph({
            perPage: 10000,
            dispatch
          })
          setOpen(false)
          handleModal(false)
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
      }}
      title={edit ? 'edit-paragraph' : 'create-paragraph'}
      done='save'
    >
      <div class='container-text'>
        {isValid(watch('paragraph')) ? (
          <BadWordsFilter target={'textarea-with-h'} text={watch('paragraph')} />
        ) : null}

        <FormGroupCustom
          noLabel
          noGroup
          value={edit?.paragraph}
          placeholder={FM('enter-paragraph')}
          type='textarea'
          name='paragraph'
          id={'textarea-with-h'}
          label={FM('paragraph')}
          // className='mb-1'
          // errors={errors}
          control={control}
          rules={{ required: true }}
        />
      </div>
      {/* <FormGroupCustom
                    value={edit?.paragraph}
                    placeholder={FM("enter-paragraph")}
                    type="textarea"
                    name="paragraph"
                    label={FM("paragraph")}
                    className='mb-1'
                    // errors={errors}
                    control={control}
                    rules={{ required: true }}
                /> */}
    </SideModal>
  )
}

export default AddUpdatePara
