import React, { useState,useMemo, useContext } from 'react'
import VideoContext from './Videocontext'
import InfoContext from '../Info/InfoContext';
const Video = (props) => {
    const initialvid=[];
    const context = useContext(InfoContext);
    const {getuser}=context;
    const {commm,changecomuser}=useState([{}])
    const[vids,setvids]=useState(initialvid)
    const[ranvids,setranvids]=useState(initialvid)
    const [vid,setvid]=useState({id:"",title:"",description:"",vidurl:"",imgurl:"",user:"",views:0,likes:0,comments:[]})
    const [someuser,changesomeuser]=useState({name:"",email:"",subscribers:0,pic:""})

    // const updatelike=async(e)=>{
    //     const response=await fetch(`http://localhost:5000/api/video/like/${e}`,{
    //         method: "PUT",
    //         headers:{
    //             'content-Type':'application/json'
    //         }
    //     });
    //     const json=await response.json();
    //     if (json.success){
    //         setvid((prev)=>({...prev,likes:json.likes}))
    //     }
    //     else{
    //         alert(json.errors[0].msg)
    //     }
    // }
    const uploadvids=async(e)=>{
        const response=await fetch("http://localhost:5000/api/video/uploadvid",{
            method: "POST",
            headers:{
                'content-Type':'application/json',
                'auth-token':localStorage.getItem('token')
            },
            body:JSON.stringify({title:e.title,description:e.description,imgurl:e.imgurl,vidurl:e.vidurl})
        });
        const json=await response.json();
        if (json.success){
            return json;
        }
        else{
            alert(json.errors[0].msg)
        }

    }
    const getvids=async()=>{
        const response= await fetch("http://localhost:5000/api/video/fetchallvideos",{
            method: "GET",
            headers:{
                'content-Type':"application/json",
                'auth-token':localStorage.getItem('token')
            },
        });
        const json=await response.json();
        setvids(initialvid);
        if(json.success){
            json.videos.map((jvid)=>{
                setvids((prev)=>[{id:jvid._id,title:jvid.title,description:jvid.description,vidurl:jvid.vidurl,imgurl:jvid.imgurl,user:jvid.user,views:jvid.views,likes:jvid.likes,comments:jvid.comments},...prev])
            })
        }
        else{
            alert("ERROR");
        }
    }

    const getuservids=async(e)=>{
        const response= await fetch(`http://localhost:5000/api/video/fetchuservideos/${e}`,{
            method: "GET",
            headers:{
                'content-Type':"application/json"
            },
        });
        const json=await response.json();
        setvids(initialvid);
        if(json.success){
            const promises = json.videos.map(async (jvid) => {
                const user = await getsomeuser(jvid.user);
                return {
                    id: jvid._id,
                    title: jvid.title,
                    description: jvid.description,
                    vidurl: jvid.vidurl,
                    imgurl: jvid.imgurl,
                    user: jvid.user,
                    views: jvid.views,
                    likes: jvid.likes,
                    comments: jvid.comments,
                    username: user.user.name,
                    subscribers: user.user.subscribers,
                    date:jvid.date
                };
            });
            const resolvedVideos = await Promise.all(promises);
            setvids([...resolvedVideos])
        }
        else{
            alert("ERROR");
        }
    }

    const getcomments=async(e)=>{
        const response=await fetch(`http://localhost:5000/api/comments/fetchallcomments/${e}`,{
            method: "GET",
            headers:{
                'content-Type':'application/json',
                'auth-token':localStorage.getItem('token')
            },
        });
        const json=await response.json();
        if (json.success){
            return (json.comments)
        }
        else{
            alert("ERROR");
        }
    }

    const addcomment=async(e,i)=>{
        const response=await fetch(`http://localhost:5000/api/comments/addcomment/${e}`,{
            method: "POST",
            headers:{
                'content-Type':'application/json',
                'auth-token':localStorage.getItem('token')
            },
            body: JSON.stringify({description:i.description})
        });
        const json=await response.json();
        if (json.success){
          await getvid(e)
        }
        else{
            alert(json.errors[0].msg)
        }
      }

    const islikevid=async(e)=>{
        const response= await fetch(`http://localhost:5000/api/auth//islikevid/${e}`,{
            method: "GET",
            headers:{
                'content-Type':"application/json",
                'auth-token':localStorage.getItem('token')
            },
        });
        const json=await response.json();
        return json;
    }
    const likevid=async(e)=>{
        const response= await fetch(`http://localhost:5000/api/auth//likevid/${e}`,{
            method: "PUT",
            headers:{
                'content-Type':"application/json",
                'auth-token':localStorage.getItem('token')
            },
        });
        const json=await response.json();
        console.log(json);
        if(json.success){
            await getvid(e)
        }
        else{
            alert("ERROR");
        }
    }
    const dislikevid=async(e)=>{
        const response= await fetch(`http://localhost:5000/api/auth//dislikevid/${e}`,{
            method: "PUT",
            headers:{
                'content-Type':"application/json",
                'auth-token':localStorage.getItem('token')
            },
        });
        const json=await response.json();
        if(json.success){
            await getvid(e)
        }
        else{
            alert("ERROR");
        }
    }
    const getvid=async(e)=>{
        const response= await fetch(`http://localhost:5000/api/video/fetchvideos/${e}`,{
            method: "GET",
            headers:{
                'content-Type':"application/json"
            },
        });
        setvids(initialvid);
        const json=await response.json();
        if(json.success){
            const user = await getsomeuser(json.videos.user);
            const comm = await getcomments(e);
            setvid({username:user.user.name,subscribers:user.user.subscribers,subscribedUsers:user.user.subscribedUsers,id:json.videos._id,title:json.videos.title,description:json.videos.description,vidurl:json.videos.vidurl,imgurl:json.videos.imgurl,user:json.videos.user,views:json.videos.views,likes:json.videos.likes,dislikes:json.videos.dislikes,comments:comm})
        }
        else{
            alert("ERROR");
        }
    }
    const subscribeuser=async(e,i)=>{
        const response=await fetch(`http://localhost:5000/api/auth/subscribe/${e}`,{
            method: "PUT",
            headers:{
                'content-Type':'application/json',
                'auth-token':localStorage.getItem('token')
            },
        });
        const json=await response.json();
        if (json.success){
          await getvid(i);
          await getuser(json.user._id)
        }
        else{
            alert(json.errors[0].msg)
        }
      }

      const unsubscribeuser=async(e,i)=>{
        const response=await fetch(`http://localhost:5000/api/auth/unsubscribe/${e}`,{
            method: "PUT",
            headers:{
                'content-Type':'application/json',
                'auth-token':localStorage.getItem('token')
            },
        });
        const json=await response.json();
        if (json.success){
          await getvid(i);
          await getuser(json.user._id)
        }
        else{
            alert(json.errors[0].msg)
        }
      }

      const issub=async(e)=>{
        const response= await fetch(`http://localhost:5000/api/auth//issub/${e}`,{
            method: "GET",
            headers:{
                'content-Type':"application/json",
                'auth-token':localStorage.getItem('token')
            },
        });
        const json=await response.json();
        return json;
    }

    const getsomeuser=async(e)=>{
        const response=await fetch(`http://localhost:5000/api/auth/getsome/${e}`,{
            method: "GET",
            headers:{
                'content-Type':'application/json'
            },
        });
        const json=await response.json();
        if (json.success){
            changesomeuser({name:json.user.name,email:json.user.email,subscribers:json.user.subscribers,subscribedUsers:json.user.subscribedUsers,pic:json.user.pic,date:json.user.date})
            return json;
        }
        else{
            alert("LOGIN ERROR");
        }
    }

    // const getcomuser=async(e)=>{
    //     const response=await fetch(`http://localhost:5000/api/auth/getsome/${e}`,{
    //         method: "GET",
    //         headers:{
    //             'content-Type':'application/json'
    //         },
    //     });
    //     const json=await response.json();
    //     if (json.success){
    //         changecomuser({name:json.user.name,email:json.user.email,subscribers:json.user.subscribers,subscribedUsers:json.user.subscribedUsers,pic:json.user.pic,date:json.user.date})
    //         return json;
    //     }
    //     else{
    //         alert("LOGIN ERROR");
    //     }
    // }
    const increaseview=async(e)=>{
        const response=await fetch(`http://localhost:5000/api/video/view/${e}`,{
            method: "PUT",
            headers:{
                'content-Type':'application/json',
                'auth-token':localStorage.getItem('token')
            },
        });
        const json=await response.json();
        if (json.success){
          await getvid(e);
        }
        else{
            alert(json.errors[0].msg)
        }
      }

    const getranvids = async () => {
        try {
            const response = await fetch("http://localhost:5000/api/video/randomvid", {
                method: "GET",
                headers: {
                    'Content-Type': "application/json"
                },
            });
            const json = await response.json();
            setranvids(initialvid);
            if (json.success) {
                const promises = json.videos.map(async (jvid) => {
                    const user = await getsomeuser(jvid.user);
                    return {
                        id: jvid._id,
                        title: jvid.title,
                        description: jvid.description,
                        vidurl: jvid.vidurl,
                        imgurl: jvid.imgurl,
                        user: jvid.user,
                        views: jvid.views,
                        likes: jvid.likes,
                        comments: jvid.comments,
                        username: user.user.name,
                        subscribers: user.user.subscribers,
                        date:jvid.date
                    };
                });
                const resolvedVideos = await Promise.all(promises);
                setranvids([...resolvedVideos]);
            } else {
                alert("ERROR");
            }
        } catch (error) {
            console.error('Error fetching random videos:', error);
        }
    }
    
    useMemo(()=>{
        if (localStorage.getItem('token')) {
          getvids();
        }
      },[])
  return (
    <VideoContext.Provider value={{vids,getvids,uploadvids,ranvids,getranvids,vid,getvid,islikevid,likevid,dislikevid,subscribeuser,issub,unsubscribeuser,commm,addcomment,someuser,getsomeuser,getuservids,increaseview}}>
        {props.children}
    </VideoContext.Provider>
  )
}

export default Video
