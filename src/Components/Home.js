import React, { useContext, useMemo } from "react";
import { Link } from 'react-router-dom';
import VideoContext from "../Context/video/Videocontext";
const Home = () => {
  const context=useContext(VideoContext);
  const {ranvids,getranvids}=context;
  useMemo(()=>{
    getranvids();
  },[])
  return (
    <div className="p-16 min-h-screen bg-gray-900">
      <div className='text-gray-400 pt-10 flex flex-wrap pl-20'>
{     ranvids.map((vid)=>{
  {
    var dateObj = new Date(vid.date);

// Format the date
var options = { day: 'numeric', month: 'short', year: 'numeric' };
var formattedDate = dateObj.toLocaleDateString('en-GB', options);

// Add ordinal suffix to day
formattedDate = formattedDate.replace(/\b(\d{1,2})\b/g, function(match, day) {
    var suffixes = ['th', 'st', 'nd', 'rd'];
    var v = day % 100;
    return day + (suffixes[(v - 20) % 10] || suffixes[v] || suffixes[0]);
});
  }
  return(
        <Link key={vid.id} to={`/video/${vid.id}`}>
          <div className='flex flex-col border-0 border-gray-600 grow basis-1/5 h-fit max-w-80 min-w-80 p-3 hover:bg-gray-800 rounded-lg hover:scale-105'>
              <div className='h-fit'><img className='rounded-xl max-h-44 min-h-44' src={vid.imgurl} alt="Girl in a jacket"/></div>
              <div className='pl-2 pt-2 font-bold'>{vid.title}</div>
              <Link to={`/pro/${vid.user}`}><div className='pl-2 text-sm hover:text-gray-300'>{vid.username}</div></Link>
              <div className='pl-2 flex justify-between mr-3'><div className='basis-1/2'>Views: {vid.views}</div> <div>{formattedDate}</div></div>
          </div>
        </Link>)
})}
    </div>
    </div>
  );
};

export default Home;