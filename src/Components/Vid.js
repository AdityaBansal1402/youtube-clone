import React, { useContext, useEffect, useState,useMemo } from 'react';
import ReactPlayer from 'react-player';
import { useParams } from 'react-router-dom';
import VideoContext from '../Context/video/Videocontext';
import { Link } from 'react-router-dom';


const Video = () => {
  const [comen,setcomen]=useState({description:""})
  const [view,setview]=useState(0);
  const context = useContext(VideoContext);
  const {issub, unsubscribeuser, vid,subscribeuser, getvid, islikevid, likevid,dislikevid,ranvids,getranvids,commm,addcomment,increaseview} = context;
  const [isLiked, setIsLiked] = useState(null);
  const [isSub, setIsSub] = useState(null);
  const params = useParams();
  const video = params.id;
  const [percentageWatched, setPercentageWatched] = useState(0);

  const handleProgress = (state) => {
    const { playedSeconds, loadedSeconds } = state;
    const percentage = (playedSeconds / loadedSeconds) * 100;
    setPercentageWatched(percentage);
    // console.log(percentageWatched)
  };
  // console.log(video)

  const changey=(e)=>{
    setcomen({...comen,[e.target.name]:e.target.value})
  }

  useEffect(()=>{
    if(percentageWatched>30 && view===0){
      increaseview(video)
      setview(1);
    }
  },[percentageWatched])

  const submitt=()=>{
    addcomment(video,comen);
    setcomen({description:""});
  }
  useMemo(()=>{
    getranvids();
  },[])

  useEffect(() => {
    const fetchIsLiked = async () => {
      await getvid(video);
      if(localStorage.getItem('token')){
      const liked = await islikevid(video);
      setIsLiked(liked);}
    };

    fetchIsLiked();
    // return () => {
    //   setIsLiked(null);
    // };
  }, [video]);

  useEffect(() => {
    const fetchIsLiked = async () => {
      if(localStorage.getItem('token')){
      const sub = await issub(vid.user);
      setIsSub(sub);}
    };

    fetchIsLiked();
    // return () => {
    //   setIsLiked(null);
    // };
  }, [vid]);
  const handleclick=async()=>{
    if(!isLiked){
      await likevid(video)
    }
    else{
      await dislikevid(video)
    }
    const liked = await islikevid(video);
    setIsLiked(liked);
  }
  const handleclickme=async()=>{
    if(!isSub){
      await subscribeuser(vid.user,video)
    }
    else{
      await unsubscribeuser(vid.user,video)
    }
    const sub = await issub(vid.user);
    setIsSub(sub);
  }
  return (
    <div className={`pl-16 pt-24 bg-gray-900 min-h-screen !overflow-hidden`}>
        <div className='flex justify-evenly'>
            {
                <div className="basis-8/12">
                <div className='rounded-lg overflow-hidden aspect-video '>
                    <ReactPlayer 
                      url={vid.vidurl} 
                      controls 
                      playing
                      width='100%'
                      height='100%'
                      onProgress={handleProgress}
                      fallback={<img src={vid.imgurl} alt="Loading..." />}
                    />
                </div>
              <div className='flex mt-10 ml-2 p-3 rounded-xl text-white justify-between bg-gray-500'>
                <div className='flex basis-3/5 items-center'>
                    <div className='flex pr-4 items-center'><img className='min-w-10 min-h-10 max-w-10 max-h-10 rounded-full' src="https://images.pexels.com/photos/709552/pexels-photo-709552.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" alt="alt"/>
                    <div className='flex flex-col'>
                        <Link to={`/pro/${vid.user}`}>
                        <div className='pl-1.5'>{vid.username}</div>
                        </Link>
                        <div className='pl-1.5 text-sm'>{vid.subscribers} subscribers</div>
                    </div>
                    {typeof isSub!=='undefined' && (
                    <button disabled={!localStorage.getItem('token')} onClick={()=>{handleclickme()}} className='bg-gray-600 rounded-full text-sm max-h-5 pl-2 pr-2 mt-6'>{(isSub)?"Subscribed":"subscribe"}</button>
                    )}</div>
                </div>
                
                <div className='flex items-center basis-1/5 justify-end'>
                  <div>
              <div className='pl-2'>{vid.likes}</div>
                          {typeof isLiked !== 'undefined' && (
              <button disabled={!localStorage.getItem('token')} onClick={()=>{handleclick()}}>
                <span className={`material-symbols-outlined text-white mt-1 pr-5 ${isLiked ? "!text-black" : ""}`}>
                  thumb_up
                </span>
              </button>
            )}
              </div>
              <div>
              <div className='pl-2'>{vid.dislikes}</div>
              <span className={`material-symbols-outlined text-white mt-1`}  disabled={!localStorage.getItem('token')}>
              thumb_down</span>
              </div>
                </div>
              </div>
              <div className='flex flex-col ml-4 mt-6 pb-10'>
              <div className='text-white border-b-2 pb-2'>Comments</div>
              {localStorage.getItem('token') && <div>
                <textarea className='w-full bg-gray-700 p-2 pl-5 rounded-t-2xl focus:outline-none focus:border-gray-500 focus:border resize-none mt-4' name='description' placeholder='description' value={comen.description} onChange={changey} />
                <div className='bg-gray-700 mt-[-6px] text-right rounded-b-2xl p-1 pr-6 ' >
                <button className='text-gray-400 pt-2 pb-2 pl-3 pr-3 hover:bg-gray-800 rounded-2xl hover:text-gray-200' onClick={()=>submitt()} type='submit' disabled={comen.description===""}>{(comen.description==="")?"Write a Comment!!":"Post"}</button>
                </div>
              </div>}
              {
                vid.comments.map((c)=>{

                  return(
                  <div key={vid.id} className='mt-4 p-3 rounded-lg text-gray-300 bg-gray-800'>
                    <Link to={`/pro/${c.userId}`}><div className='text-xs'>{c.name}</div></Link>
                    <div className='text-sm'>{c.description}</div>
                  </div>)
                })
              }
                  
              </div>
            </div>
}
            <div className="rounded-lg basis-3/12 flex flex-col ">
            {     ranvids.map((vid)=>{
              if(vid.id===video){
                return null;
              }
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
          <div className='flex border-0 border-gray-600 grow basis-1/5 h-fit max-w-96 min-w-96 p-3 hover:bg-gray-800 rounded-lg hover:scale-105'>
              <div className='h-fit'><img className='rounded-xl max-h-24 min-h-24 max-w-40 min-w-40' src={vid.imgurl} alt="Girl in a jacket"/></div>
              <div className='flex flex-col'>
              <div className='pl-2 pt-2 font-bold'>{vid.title}</div>
              <Link to={`/pro/${vid.user}`}><div className='pl-2 text-sm hover:text-gray-300'>{vid.username}</div></Link>
              <div className='pl-2 flex justify-between mr-3 text-xs'><div className='basis-1/2'>Views: {vid.views}</div> <div>{formattedDate}</div></div>
              </div>
          </div>
        </Link>)
})}
                
            </div>
        </div>

      

    </div>
  );
}

export default Video;