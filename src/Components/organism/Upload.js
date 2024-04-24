import React,{useContext, useEffect, useState} from 'react'
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import app from '../../firebase/firebase'
import VideoContext from '../../Context/video/Videocontext';
import { useNavigate } from 'react-router-dom';

const Upload = () => {
    const history=useNavigate()
    const context=useContext(VideoContext);
    const {uploadvids}=context;
    const [cont,setcont]=useState({title:"",description:"",imgurl:"",vidurl:""});
    const [img,setimg]=useState(undefined);
    const [vid,setvid]=useState(undefined);
    const [vidperc,setvidperc]=useState(0);
    const [imgperc,setimgperc]=useState(0);
    const onchange=(e)=>{
        setcont({...cont,[e.target.name]:e.target.value});
    }
    const uploadFile=(file,urltype)=>{
        const storage = getStorage(app);
        const fileName = new Date().getTime()+file.name;
        const storageRef = ref(storage,fileName);
        const uploadTask = uploadBytesResumable(storageRef, file);

        uploadTask.on('state_changed',
          (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            (urltype==="imgurl")? setimgperc(Math.round(progress)):setvidperc(Math.round(progress));
            switch (snapshot.state) {
              case 'paused':
                console.log('Upload is paused');
                break;
              case 'running':
                console.log('Upload is running');
                break;
              default:
                break
            }
          }, 
          (error) => {},
          () => {
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                console.log(downloadURL)
              setcont((prev)=>{
                return {...prev,[urltype]:downloadURL}
              })
            });
          }
        );
    }
    useEffect(()=>{
        vid && uploadFile(vid,"vidurl")
    },[vid])

    useEffect(()=>{
        img && uploadFile(img,"imgurl")
    },[img])
    const handlesubmit=async(e)=>{
        e.preventDefault();
        const json=await uploadvids(cont);
        if(json.success){
        history('/profile/about')}
    }
  return (
    <div>
        <div className='text-gray-400 pt-10 flex flex-wrap pl-36'>
            <form className='font-mono flex flex-col' onSubmit={(e)=>handlesubmit(e)}>
                <input type='text' name='title' placeholder='Title' value={cont.title} onChange={onchange} className='placeholder-gray-200 bg-gray-700 pl-4 pt-1 pb-1 focus:outline-gray-500 focus:outline-none rounded'/>
                <textarea name='description' rows={7} cols={50} placeholder='Description' value={cont.description} onChange={onchange} className='placeholder-gray-200 bg-gray-700 pl-4 pt-1 pb-1 focus:outline-gray-500 focus:outline-none rounded mt-4 resize-none'/>
                <label htmlFor='image'>Select a Thumbnail</label>
                {imgperc>0?("Uploading"+imgperc+"%"):(
                <input type='file' name='image' id='image' accept='image/*' placeholder='Thumbnail' className='' onChange={(e)=>{setimg(e.target.files[0])}}/>
                )}<label htmlFor='image'>Upload the video</label>
                {vidperc>0?("Uploading"+vidperc+"%"):(<input type='file' name='video' id='video' accept='video/*' placeholder='video' className=''onChange={(e)=>{setvid(e.target.files[0])}}/>
                )}<button type='submit' className='bg-gray-700 max-w-36 ml-[35%] mt-10'>Upload</button>
            </form>
        </div>
    </div>
  )
}

export default Upload
