import {React,useState, useMemo} from 'react'
import InfoContext from './InfoContext'

const Info = (props) => {
    const initialinfo=[]
    // const host='localhost:5000'
    const [info,updateinfo]=useState(initialinfo)
    const [user,changeuser]=useState({name:"",email:""})

    const getuser=async()=>{
      const response=await fetch("http://localhost:5000/api/auth/getuser",{
          method: "GET",
          headers:{
              'content-Type':'application/json',
              'auth-token':localStorage.getItem('token')
          },
      });
      const json=await response.json();
      if (json.success){
        changeuser({name:json.user.name,email:json.user.email,subscribers:json.user.subscribers,subscribedUsers:json.user.subscribedUsers,pic:json.user.pic,date:json.user.date})
      }
      else{
          alert("LOGIN ERROR");
      }
  }


  const getinfo=async()=>{
    const response=await fetch("http://localhost:5000/api/notes/fetchallnotes",{
        method: "GET",
        headers:{
            'content-Type':'application/json',
            'auth-token':localStorage.getItem('token')
        },
    });
    const json=await response.json();
    updateinfo(initialinfo);
    if (json.success){
      json.notes.map((jnote)=>{
        updateinfo(previnfo => [{id:jnote._id,title:jnote.title,description:jnote.description},...previnfo])
      })
    }
    else{
        alert("ERROR");
    }
}
const getnote=async(e)=>{
  const response=await fetch("http://localhost:5000/api/notes/addnotes",{
      method: "POST",
      headers:{
          'content-Type':'application/json',
          'auth-token':localStorage.getItem('token')
      },
      body: JSON.stringify({title:e.title,description:e.description,tag:e.title})
  });
  const json=await response.json();
  if (json.success){
    getinfo()
  }
  else{
      alert(json.errors[0].msg)
  }
}
const updatenote=async(e)=>{
  const response=await fetch(`http://localhost:5000/api/notes/updatenote/${e.id}`,{
      method: "PUT",
      headers:{
          'content-Type':'application/json',
          'auth-token':localStorage.getItem('token')
      },
      body: JSON.stringify({title:e.title,description:e.description,tag:e.title})
  });
  const json=await response.json();
  if (json.success){
    getinfo()
  }
  else{
      alert(json.errors[0].msg)
  }
}

const deletenote=async(e)=>{
  const response=await fetch(`http://localhost:5000/api/notes/deletenote/${e.id}`,{
      method: "DELETE",
      headers:{
          'content-Type':'application/json',
          'auth-token':localStorage.getItem('token')
      },
  });
  const json=await response.json();
  if (json.success){
    getinfo()
  }
  else{
      alert(json.errors[0].msg)
  }
}
useMemo(()=>{
  if (localStorage.getItem('token')) {
    getinfo();
  }
},[])
    // const getinfo= ()=>{

    // }
  return (
    <InfoContext.Provider value={{info,getinfo,user,getuser,getnote,updatenote,deletenote}}>
        {props.children}
    </InfoContext.Provider>
  )
}

export default Info
