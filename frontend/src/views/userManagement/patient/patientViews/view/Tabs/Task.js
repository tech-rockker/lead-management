/* eslint-disable no-unneeded-ternary */
import React from 'react'
import { Container } from 'reactstrap'
import Task from '../../../../../masters/tasks'

const TaskTab = ({ user }) => {
  return (
    <>
      <Container>
        <Task key={`task-for-${user?.id}`} dUser={user ? true : false} user={user} />
      </Container>
    </>
  )
}

export default TaskTab
