import React,{useContext, useEffect} from 'react'
import { BrowserRouter as Router, Routes, Route, Link, NavLink,Outlet } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import VideoContext from '../Context/video/Videocontext';

const Pro = () => {
    const params=useParams();
    const user=params.id;
    const context=useContext(VideoContext);
    const {getsomeuser,someuser}=context;

    useEffect(()=>{
        getsomeuser(user);
    },[user])
  return (
    <div className='min-h-screen bg-gray-800'>
      <div className='flex flex-col'>
        <div className='pt-20 pl-32 border-b-4 border-gray-600 sticky top-0 bg-gray-950'>
            <h1 className='text-white text-xl pb-6 font-semibold font-mono'>Hello {someuser.name}</h1>
            <ul className="flex flex-wrap -mb-px">
                <li className="me-2">
                    <NavLink to='pabout'  className="text-gray-400 inline-block p-4 border-b-4 border-transparent rounded-t-lg hover:text-gray-600 hover:border-white dark:hover:text-white">Profile</NavLink>
                </li>
                <li className="me-2">
                    <NavLink to='pcommunity'  className="text-gray-400 inline-block p-4  border-b-4 border-transparent rounded-t-lg hover:text-gray-600 hover:border-white dark:hover:text-white">Community</NavLink>
                </li>
            </ul>
        </div>
        <div className='text-gray-300'>
            <Outlet/>
        </div>
      </div>
    </div>
  )
}

export default Pro
