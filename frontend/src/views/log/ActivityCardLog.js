import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { User } from 'react-feather'
import { VerticalTimeline, VerticalTimelineElement } from 'react-vertical-timeline-component'
import {
  formatDate,
  getValidTime,
  decrypt,
  formatMessage,
  sortedActivity
} from '../../utility/Utils'
import { fetchOnlyActivityLog } from '../../utility/apis/log'
import { FM } from '../../utility/helpers/common'
import 'react-vertical-timeline-component/style.min.css'
import './activityLogStyle.scss'

const ActivityCardLog = ({ id }) => {
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(true)
  const activity = useSelector((state) => state.log.logs)

  const fetchData = (id) => {
    if (id) {
      fetchOnlyActivityLog({
        id,
        dispatch,
        success: (data) => {
          setLoading(false) // Set loading to false when data is fetched
        },
        error: (error) => {
          console.error('Error fetching activity:', error)
          setLoading(false) // Set loading to false in case of an error
        }
      })
    }
  }

  useEffect(() => {
    fetchData(id)
  }, [dispatch])

  let activityLogSorted = null

  if (loading) {
    // Show loading until data is fetched
    return <div className='d-flex justify-content-center my-2'>{FM('Loading....')}</div>
  } else if (Object.keys(activity).length === 0) {
    // If activity is an empty array, show "no-record" message
    return <div className='d-flex justify-content-center my-2'>{FM('no-record')}</div>
  } else if (!loading && Array.isArray(activity) && activity.length > 0) {
    // If activity has data, then sort activity in descending order of created date
    activityLogSorted = sortedActivity(activity)
  }

  return (
    <>
      {!loading && activity.length > 0 ? (
        <VerticalTimeline lineColor='lightGrey' layout='2-columns'>
          <div className='unique-container'>
            {activityLogSorted.map((entry, index) => (
              <VerticalTimelineElement
                key={index}
                contentArrowStyle={{ borderRight: '7px solid #5262AA', position: 'absolute' }}
                contentStyle={{
                  background: 'transparent',
                  padding: '20px',
                  borderRadius: '20px',
                  border: '3px solid #5262AA'
                }}
                iconStyle={{
                  background: '#5262AA',
                  color: '#5262AA',
                  padding: '5px'
                }}
                date={
                  <>
                    <strong>{formatDate(entry?.created_at, 'DD MMMM YYYY')}</strong>{' '}
                    <strong>{getValidTime(entry?.created_at?.slice(11, 27), 'h:mm A')}</strong>
                  </>
                }
                icon={null}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <User className='icon' />
                  <h3 className='vertical-timeline-element-title'>{decrypt(entry.causer_name)}</h3>
                </div>
                {entry.description === 'created' && entry.module === 'journal' ? (
                  <p>{FM(`activity-journal-created`)}</p>
                ) : entry.description === 'created' && entry.module === 'deviation' ? (
                  <p>{FM(`activity-deviation-created`)}</p>
                ) : entry.description === 'deleted' && entry.module === 'activity' ? (
                  <p>{FM(`activity-deleted`)}</p>
                ) : entry.description === 'deleted_employee' ? (
                  <span>
                    <br />
                    <strong>{decrypt(entry.data)}</strong> {FM('remove-from-activity')}
                  </span>
                ) : (
                  <ul style={{ listStyle: 'none', padding: 0 }}>
                    {Object.keys(entry.data).map((key, index, keysArray) => (
                      <li key={index}>
                        {entry.description === 'assign_employee' ? (
                          <span>
                            <br /> {FM(`activity-assign-to`)}{' '}
                            <strong>{decrypt(entry.data[key])}</strong>
                          </span>
                        ) : entry.description === 'created' && entry.module === 'task' ? (
                          <>
                            <p>{FM(`activity-task-created`)}</p>
                            <p>
                              <strong>{FM(key)}</strong> : {entry.data[key]}
                            </p>
                          </>
                        ) : entry.description === 'updated' && entry.module === 'activity' ? (
                          <>
                            {index === 0 && <p>{FM(`activity-updated`)}</p>}{' '}
                            <p
                              dangerouslySetInnerHTML={{
                                __html: formatMessage(key, entry.data[key])
                              }}
                            ></p>
                          </>
                        ) : null}
                      </li>
                    ))}
                  </ul>
                )}
              </VerticalTimelineElement>
            ))}
          </div>
        </VerticalTimeline>
      ) : null}
    </>
  )
}

export default ActivityCardLog
