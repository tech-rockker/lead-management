// ** Third Party Components
import PropTypes from 'prop-types'

// ** Reactstrap Imports
import { Card, CardBody } from 'reactstrap'

const StatsVertical = ({ icon, color, stats, statTitle, className, classNameBody }) => {
  return (
    <Card className={`text-center ${className}`}>
      <CardBody className={classNameBody}>
        <div className={`avatar p-50 m-0 mb-1 ${color ? `bg-light-${color}` : 'bg-light-primary'}`}>
          <div className='avatar-content'>{icon}</div>
        </div>
        <h2 className='fw-bolder'>{stats}</h2>
        <p className='card-text line-ellipsis fw-bold'>{statTitle}</p>
      </CardBody>
    </Card>
  )
}

export default StatsVertical

// ** PropTypes
StatsVertical.propTypes = {
  className: PropTypes.string,
  classNameBody: PropTypes.string,
  icon: PropTypes.element.isRequired,
  color: PropTypes.string.isRequired,
  stats: PropTypes.string.isRequired,
  statTitle: PropTypes.string.isRequired
}
