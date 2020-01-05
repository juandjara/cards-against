import React, { useState } from 'react';

function LoginForm (props) {
  const [name, setName] = useState("")
  const [room, setRoom] = useState("")

  function handleSubmit (ev) {
    ev.preventDefault()
    if (!name) {
      return window.alert("Name can't be empty");
    }
    props.onSubmit({ name, room })
  }

  return (
    <form style={{ padding: '1rem', backgroundColor: '#f4f4f4' }} onSubmit={handleSubmit}>
      <label style={{display: 'block'}}>Name</label>
      <input
        style={{ marginBottom: 12 }}
        id="name"
        onChange={ev => setName(ev.target.value.trim())}
        required
        placeholder="What is your name .."
      />
      <label style={{display: 'block'}}>Room</label>
      <input
        style={{ marginBottom: 12 }}
        id="room"
        onChange={ev => setRoom(ev.target.value.trim())}
        placeholder="What is your room .."
      />
      <button style={{ display: 'block' }} type="submit">Submit</button>
    </form>
  )
}

export default LoginForm
