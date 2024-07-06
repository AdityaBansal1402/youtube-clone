import React, { useContext, useEffect, useMemo } from 'react'
import VideoContext from '../../Context/video/Videocontext';
import InfoContext from '../../Context/Info/InfoContext';


const About = () => {
  const context = useContext(VideoContext);
  const usercontext = useContext(InfoContext);
  const { user, getuser } = usercontext;
  const { vids, getvids } = context;

  useMemo(()=>{
    getvids();
  },[])

  return (
    <div>
      <div className='text-gray-400 pt-10 flex flex-wrap pl-36'>
{     vids.map((vid)=>{
          return( 
            <div key={vid.id} className='flex flex-col border-0 border-gray-600 grow basis-1/4 h-fit max-w-min min-w-80'>
               <div className='h-fit'><img className='rounded-xl max-h-44' src={vid.imgurl} alt="Girl in a jacket"/></div>
               <div className='pl-2 pt-2 font-bold'>{vid.title}</div>
               <div className='pl-2 text-sm'>{user.name.split(' ')[0]}</div>
               <div className='pl-2 flex'><div className='basis-1/2'>Views: {vid.views}</div></div>
             </div>)
        })}
      </div>
    </div>
  )
}

export default About;
