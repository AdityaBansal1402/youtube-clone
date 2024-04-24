import React from 'react'
import { Link } from 'react-router-dom'

const Miniside = () => {
  return (
    <div className='fixed top-14'>
        <div className='flex border-t border-gray-800 items-center pt-5 flex-col h-screen bg-gray-950 p-3 w-fit text-white'>
            <Link className='pb-4 border-b border-gray-700' to='/'><span
              className={`material-symbols-outlined text-white mt-1`}
            >
              Home
            </span></Link>
            <Link className='pb-4 pt-4' to='/profile'><span
              className={`material-symbols-outlined text-white mt-1`}
            >
              account_circle
            </span></Link>
        </div>
    </div>
  )
}

export default Miniside
