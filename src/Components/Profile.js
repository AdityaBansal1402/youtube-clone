import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, NavLink,Outlet } from 'react-router-dom';
import InfoContext from '../Context/Info/InfoContext';

const Profile = () => {
  const usercontext = useContext(InfoContext);
  const { user, getuser } = usercontext;
  return (
    <div className='bg-gray-950 min-h-screen'>
      {(localStorage.getItem('token'))?<div className='flex flex-col'>
        <div className='pt-20 pl-32 border-b-4 border-gray-600 sticky top-0 bg-gray-950'>
            <h1 className='text-white text-xl pb-6 font-semibold font-mono'>Hello {user.name.split(' ')[0]}</h1>
            <ul className="flex flex-wrap -mb-px">
                <li className="me-2">
                    <NavLink to='about'  className="text-gray-400 inline-block p-4 border-b-4 border-transparent rounded-t-lg hover:text-gray-600 hover:border-white dark:hover:text-white">Profile</NavLink>
                </li>
                <li className="me-2">
                    <NavLink to='community'  className="text-gray-400 inline-block p-4  border-b-4 border-transparent rounded-t-lg hover:text-gray-600 hover:border-white dark:hover:text-white">Community</NavLink>
                </li>
                <li className="me-2">
                    <NavLink to='upload'  className="text-gray-400 inline-block p-4  border-b-4 border-transparent rounded-t-lg hover:text-gray-600 hover:border-white dark:hover:text-white">Upload</NavLink>
                </li>
            </ul>
        </div>
        <div className='text-gray-300'>
            <Outlet/>
        </div>
      </div>:""}
    </div>
  )
}

export default Profile
