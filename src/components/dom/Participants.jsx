import React from 'react'
import { usePresence, assertConfiguration } from '@ably-labs/react-hooks'

export default function Participants() {
  const ably = assertConfiguration()
  const [presenceData] = usePresence('game')

  const presenceList = presenceData.map((member, index) => {
    const isItMe = member.clientId === ably.auth.clientId ? '(me)' : ''

    return (
      <li
        key={index}
        className={`${isItMe ? 'text-green-500' : 'text-red-500'}`}
      >
        <span>{member.clientId}</span>
        <span className='ml-1'>{isItMe}</span>
      </li>
    )
  })

  return (
    <div className='fixed w-64 p-4 text-white rounded-lg bottom-4 left-4 bg-slate-600'>
      <h2 className='mb-3 font-bold'>Presence</h2>
      <ul className='text-xs  space-y-2'>{presenceList}</ul>
    </div>
  )
}
