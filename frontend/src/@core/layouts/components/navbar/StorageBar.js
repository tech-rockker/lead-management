import { UncontrolledTooltip } from 'reactstrap'

const StorageBar = ({ totalStorage, usedStorage }) => {
  // Calculate the percentage of used storage
  const percentageUsed = (usedStorage / totalStorage) * 100

  // Style for the storage bar
  const barStyle = {
    width: `${percentageUsed}%`,
    backgroundColor: '#7367f0', // #00cfe8 #7367f0
    height: '10px',
    borderRadius: '5px'
  }

  return (
    <div className='align-items-center ms-auto'>
      <div>
        <p className='mb-0 text-dark fw-bolder text-small-12'>Storage:</p>
        <UncontrolledTooltip target={`storage`}>
          <p className='mb-0 fw-bold text-truncate text-small-12'>
            {`${(usedStorage / 1024).toFixed(2)} GB used out of ${(totalStorage / 1024).toFixed(
              2
            )} GB`}
          </p>
        </UncontrolledTooltip>
      </div>
      <div
        className='d-flex align-items-center'
        id={`storage`}
        role={'button'}
        style={{
          marginTop: '10px',
          width: '200px',
          backgroundColor: '#dae1e7', // #dae1e7 #82868b
          borderRadius: '5px'
        }}
      >
        <div style={barStyle}></div>
      </div>
    </div>
  )
}

export default StorageBar
