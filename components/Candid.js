import React from 'react'

export default function Candid({ children, avatar, username, timestamp, description }) {
  return (
    <div className="bg-white p-8 border-b-2 rounded-lg">
        <div className="flex items-center gap-2">
            <img 
                src={avatar} 
                alt="user's profile image"
                className="w-10 rounded-full"
            />
            <h2 className="text-sm">{username}</h2>
        </div>
        <div className="py-4">
            <p>{description}</p>
        </div>
        {children}
    </div>
  )
}
