import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Form } from 'reactstrap'
import { useRedux } from '../../../redux/useRedux'
import { FM } from '../../../utility/helpers/common'
import Show from '../../../utility/Show'
import { manageFileFilter } from '../../../utility/Utils'
import FormGroupCustom from '../../components/formGroupCustom'
import SideModal from '../../components/sideModal/sideModal'

const FileFilter = ({ show, handleFilterModal, setFilterData, filterData }) => {
  const {
    reduxStates: {
      auth: { userData }
    }
  } = useRedux()
  const {
    register,
    formState: { errors },
    handleSubmit,
    control,
    getValues,
    watch,
    reset
  } = useForm()
  const [open, setOpen] = useState(show)
  const [loading, setLoading] = useState(false)

  const submitFilter = (d) => {
    setFilterData(d)
  }

  // Show/Hide Modal
  useEffect(() => {
    if (show) setOpen(true)
    if (!show) reset()
  }, [show])

  return (
    <SideModal
      loading={loading}
      handleSave={handleSubmit(submitFilter)}
      open={open}
      handleModal={() => {
        setOpen(false)
        handleFilterModal(false)
      }}
      title={FM('file-filter')}
      done='filter'
    >
      <Form>
        <FormGroupCustom
          placeholder={FM('title')}
          type='text'
          name='title'
          label={FM('title')}
          className='mb-1'
          control={control}
          rules={{ required: false }}
        />
        <Show IF={userData?.user_type_id === 2}>
          <FormGroupCustom
            label={FM('uploaded-by')}
            name={'user_type_id'}
            type={'select'}
            isClearable
            defaultOptions
            className='mb-2'
            control={control}
            options={manageFileFilter()}
          />
        </Show>
      </Form>
    </SideModal>
  )
}

export default FileFilter
