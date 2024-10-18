import React, { useState } from 'react'
import { Button, Input } from 'reactstrap'

const bads = [
  'arse',
  'ass',
  'asshole',
  'bastard',
  'bitch',
  'bollocks',
  'bugger',
  'bullshit',
  'crap',
  'damn',
  'frigger'
]

const Profanity = () => {
  const [text, setText] = useState('')
  const [x, setX] = useState(null)

  const badsCheck = (text) => {
    const foundBads = bads.filter((word) => text.toLowerCase().includes(word.toLowerCase()))
    if (foundBads.length) {
      setX(<div className='text-danger'>Yes</div>)
    } else {
      setX(<div>No</div>)
    }
  }

  return (
    <div>
      <Input
        className='mb-1'
        type='textarea'
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      {x}
      <Button onClick={() => badsCheck(text)}>check</Button>
    </div>
  )
}
export default Profanity
