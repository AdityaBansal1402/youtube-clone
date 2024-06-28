import React, { useContext, useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import VideoContext from "../Context/video/Videocontext";

const Home = () => {
  const context = useContext(VideoContext);
  const { ranvids, getranvids } = context;
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);

  useEffect(() => {
    getranvids();

    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className={`${screenWidth <= 850 ? "p-[8%]" : "p-[5%]"} min-h-screen bg-gray-900`}>
      <div className="text-gray-400 pt-10 grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {ranvids.map((vid) => {
          const dateObj = new Date(vid.date);
          const options = { day: 'numeric', month: 'short', year: 'numeric' };
          let formattedDate = dateObj.toLocaleDateString('en-GB', options);
          formattedDate = formattedDate.replace(/\b(\d{1,2})\b/g, (match, day) => {
            const suffixes = ['th', 'st', 'nd', 'rd'];
            const v = day % 100;
            return day + (suffixes[(v - 20) % 10] || suffixes[v] || suffixes[0]);
          });

          return (
            <Link key={vid.id} to={`/video/${vid.id}`}>
            <div className='flex flex-col border-0 border-gray-600 grow basis-1/5 h-fit p-3 hover:bg-gray-800 rounded-lg hover:scale-105'>
                <div className='h-fit'><img className='rounded-xl ' src={vid.imgurl} alt="Girl in a jacket"/></div>
                <div className='pl-2 pt-2 font-bold'>{vid.title}</div>
                <Link to={`/pro/${vid.user}`}><div className='pl-2 text-sm hover:text-gray-300'>{vid.username}</div></Link>
                <div className='pl-2 flex justify-between mr-3'><div className='basis-1/2'>Views: {vid.views}</div> <div>{formattedDate}</div></div>
            </div>
          </Link>
          );
        })}
      </div>
    </div>
  );
};

export default Home;
