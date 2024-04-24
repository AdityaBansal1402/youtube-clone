import React,{useContext,useState} from 'react'
import InfoContext from '../../Context/Info/InfoContext'
const Community = () => {
  const context=useContext(InfoContext);
  const [note,changenote]=useState({title:"",description:""})
  const [editnote,changeeditnote]=useState({id:"",title:"",description:""})
  const {info,getnote,user,updatenote,deletenote}=context;
  const [edit,toggleedit]=useState(-1)
  const changey=(e)=>{
    changenote({...note,[e.target.name]:e.target.value})
  }
  const updatey=(e)=>{
    changeeditnote({...editnote,[e.target.name]:e.target.value})
  }
  const handlePost = () => {
    getnote(note);
    changenote({title:"",description:""})
  }
  const edityy=(e,i)=>{
    changeeditnote({id:e.id,title:e.title,description:e.description})
    toggleedit(i)
  }
  const handleDelete=(e)=>{
    deletenote(e)
  }
  const handleEdit=()=>{
    updatenote(editnote);
    toggleedit(-1);
  }
    return (
    <div className='pt-8 pl-36 bg-gray-950'>
        <div className='flex flex-col w-4/6 border border-gray-800 rounded-2xl'>
        <textarea rows={2} name='title' value={note.title} onChange={changey} className='bg-gray-900 border-b border-gray-800 p-2 pl-5 rounded-t-2xl focus:outline-none focus:border-gray-700 focus:border resize-none' placeholder='Title'/>    
        <textarea rows={7} name='description' value={note.description} onChange={changey} className='bg-gray-900 p-2 pl-5 focus:border focus:!border-gray-700 focus:outline-none resize-none' placeholder='Description'/>    
        <div className='bg-gray-900 text-right rounded-b-2xl p-4 pr-6 ' >
            <button type='button' onClick={handlePost} className='bg-gray-800 p-2 pl-6 pr-6 rounded-full hover:bg-gray-700'>Post</button>
        </div>
        </div>
        <div className='flex flex-col mt-24 w-4/6 h-fit'>
            {
                info.map((inf,index)=>{
                    return (
                        <>
                        {!(edit===index)?(<div key={index} className='flex flex-col px-10 py-5 border border-gray-800 rounded-xl mb-10 bg-dark-primary'>
                            <div className='p-1 text-gray-500 font-extrabold bg-gray-900 w-32 text-center rounded-full'>{user.name}</div>
                            <div className='pl-8 pt-2 font-bold'>{inf.title}</div>
                            <div className='pl-8'>{inf.description}</div>
                            <div className=' text-right flex justify-end' >
                                <button type='button' onClick={()=>{edityy(inf,index)}} className='bg-gray-800 mr-2 p-2 px-5 rounded-full hover:bg-gray-700'>Edit</button>
                                <button type='button' onClick={()=>handleDelete(inf)} className='bg-gray-800 p-2 px-5 rounded-full hover:bg-gray-700 text-red-400'>Delete</button>
                            </div>
                        </div>):        (<div key={index} className='flex flex-col w-full border border-gray-800 rounded-2xl mb-10'>
                        <textarea rows={2} value={editnote.title} name='title' onChange={updatey} className='bg-gray-900 border-b border-gray-800 p-2 pl-5 rounded-t-2xl focus:outline-none focus:border-gray-700 focus:border resize-none' placeholder='Title'/>    
                        <textarea rows={2} value={editnote.description} name='description' onChange={updatey} className='bg-gray-900 p-2 pl-5 focus:border focus:!border-gray-700 focus:outline-none resize-none' placeholder='Description'/>    
                        <div className='bg-gray-900 text-right rounded-b-2xl p-4 pr-6 ' >
                            <button type='button' onClick={handleEdit} className='bg-gray-800 p-2 pl-6 pr-6 rounded-full hover:bg-gray-700'>Edit</button>
                        </div>
                        </div>)}
                        </>
                    )
                })
            }
        </div> 
    </div>
  )
}

export default Community
