// ** Icons Import
import { Heart } from 'react-feather'
import { FM } from '../../../../utility/helpers/common'

const Footer = () => {
  return (
    <p className='clearfix mb-0'>
      {/* <span className='float-md-start d-block d-md-inline-block mt-25'>
                Newrise Technosys Pvt. Ltd {' '} © {new Date().getFullYear()}
                <span className='d-none d-sm-inline-block'>, {FM("all-rights-reserved")}</span>
            </span> */}
      <span className='float-md-end d-none d-md-block'>
        {FM('hand-crafted-made-with')}
        <Heart size={14} />
      </span>
    </p>
  )
}

export default Footer
