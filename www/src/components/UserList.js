import React, { Fragment } from 'react'

function UserList ({ users }) {
  return (
    <Fragment>
      <p>People in this room</p>
      <ul>
        {users.map(u => (
          <li key={u.id}>
            {u.name}
          </li>
        ))}
      </ul>
    </Fragment>
  )
}

export default UserList
