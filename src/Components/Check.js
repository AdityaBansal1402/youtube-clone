import {React,useState,useContext} from 'react'
import Themecontext from '../Context/Theme/Theme'
import InfoContext from '../Context/Info/InfoContext';
import {useNavigate} from 'react-router-dom'
import avatar from '../assets/image/profile-circle.png'
const Check = () => {
    const context2=useContext(InfoContext);
    const context=useContext(Themecontext);
    let history=useNavigate();
    const [credentials,setcredentials]=useState({pic:"",name:"",email:"",password:""})
    const [change,setchange]=useState(false);
    const {light}=context;
    const {info,updateinfo}=context2;

    const handleSubmit=async(e)=>{
        console.log("hello")
        e.preventDefault();
        console.log(JSON.stringify({email:credentials.email,password:credentials.password}));
        const response=await fetch("http://localhost:5000/api/auth/login",{
            method: "POST",
            headers:{
                'content-Type':'application/json'
            },
            body: JSON.stringify({email:credentials.email,password:credentials.password})
        });
        const json=await response.json();
        if (json.success){
            localStorage.setItem('token',json.authtoken);
            history('/');
        }
        else{
            alert("INVALID CREDENTIALS");
        }
        console.log(json);
    }
    const handleUserSubmit=async(e)=>{
        e.preventDefault();

        const response=await fetch("http://localhost:5000/api/auth/createuser",{
            method: "POST",
            headers:{
                'content-Type':'application/json'
            },
            body: JSON.stringify({name:credentials.name,email:credentials.email,password:credentials.password})
        });
        const json=await response.json();
        if (json.success){
            localStorage.setItem('token',json.authtoken);
            history('/');
        }
        else{
            alert("INVALID CREDENTIALS");
        }
        console.log(json);
    }
    const onchange=(e)=>{
        e.preventDefault()
        setcredentials({...credentials,[e.target.name]:e.target.value})
    }
    const changey=()=>{
        setchange(prevchange=>!prevchange)
        setcredentials({name:"",email:"",password:""})
    }
    const handleFileUpload=async(e)=>{
        const file=e.target.files[0]
        const base64 =await converToBase64(file);
        console.log(base64)
    }
  return (
    <div className='flex justify-center items-center min-h-screen bg-zinc-800' >
        <div className='flex flex-wrap flex-col justify-center w-[50%] ml-[5%]'>
        
        {(!change)? <div className="flex text-white rounded-2xl min-h-full flex-col justify-center px-6 py-12 lg:px-8 grow bg-zinc-900">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
            <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-white">Sign in to your account</h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
            <form className="space-y-6" action="#" method="POST" onSubmit={(e)=>handleSubmit(e)}>
            <div>
                <label htmlFor="email" className="block text-sm font-medium leading-6 text-white">Email address</label>
                <div className="mt-2">
                <input id="email" name="email" type="email" autoComplete="email" required className="block w-full rounded-md border-0 py-1.5 text-zinc-950 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 p-2" value={credentials.email} onChange={onchange} />
                </div>
            </div>

            <div>
                <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-sm font-medium leading-6 text-white">Password</label>
                <div className="text-sm">
                    <a href="#" className="font-semibold text-indigo-600 hover:text-indigo-500">Forgot password?</a>
                </div>
                </div>
                <div className="mt-2">
                <input id="password" name="password" type="password" autoComplete="current-password" required className="p-2 block w-full rounded-md border-0 py-1.5 text-zinc-950 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" value={credentials.password} onChange={onchange} />
                </div>
            </div>

            <div className='flex justify-center'>
                <button type="submit" className="flex w-3/4 justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Sign in</button>
            </div>
            <div className='flex justify-center'>
                <button type="button" className="flex !justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600" onClick={changey}>Create Account</button>
            </div>
            </form>

        </div>
        </div>:
                <div className="flex min-h-ful text-white rounded-2xl flex-col justify-center px-6 py-12 lg:px-8 grow bg-zinc-900">
                <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                    <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-white">Create New Account</h2>
                </div>
        
               <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                    <form className="space-y-6" action="#" method="POST" onSubmit={handleUserSubmit}>
                    <div>
                        <label htmlFor="file_upload" className="flex justify-center text-sm font-medium leading-6 text-white"><img className='w-1/4' src={avatar} alt=" "></img></label>
                        <div className="mt-2">
                        <input id="file_upload" label='Image' name="pic" type="file" autoComplete="pic" required className="p-2 w-full rounded-md border-0 py-1.5 text-white shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 hidden" accept='.jpeg, .png, .jpg' onChange={(e)=>handleFileUpload(e)} />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium leading-6 text-white">name</label>
                        <div className="mt-2">
                        <input id="name" name="name" type="name" autoComplete="name" required className="p-2 block w-full rounded-md border-0 py-1.5 text-zinc-950 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" value={credentials.name} onChange={onchange} />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium leading-6 text-white">Email address</label>
                        <div className="mt-2">
                        <input id="email" name="email" type="email" autoComplete="email" required className="p-2 block w-full rounded-md border-0 py-1.5 text-zinc-950 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" value={credentials.email} onChange={onchange} />
                        </div>
                    </div>
        
                    <div>
                        <div className="flex items-center justify-between">
                        <label htmlFor="password" className="block text-sm font-medium leading-6 text-white">Set Password</label>
        
                        </div>
                        <div className="mt-2">
                        <input id="password" name="password" type="password" autoComplete="current-password" required className="p-2 block w-full rounded-md border-0 py-1.5 text-zinc-950 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" value={credentials.password} onChange={onchange} />
                        </div>
                    </div>
                    <div>
                        <div className="flex items-center justify-between">
                        <label htmlFor="password" className="block text-sm font-medium leading-6 text-white">Confirm Password</label>
        
                        </div>
                        <div className="mt-2">
                        <input id="cpassword" name="password" type="password" autoComplete="current-password" required className="block w-full p-2 rounded-md border-0 py-1.5 text-zinc-950 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
                        </div>
                    </div>
        
                    <div className='flex justify-center'>
                        <button type="submit" className="flex w-3/4 !justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Create Account</button>
                    </div>
                    <div className='flex justify-center'>
                        <button type="button" className="flex !justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600" onClick={changey}>Sign In</button>
                    </div>
                    </form>
        
                </div>
                </div>}


        
        </div>

    </div>

  )
}

export default Check


function converToBase64(file){
    return new Promise((resolve, reject)=>{
        const fileReader= new FileReader();
        fileReader.readAsDataURL(file);
        fileReader.onload=()=>{
            resolve(fileReader.result)
        }
        fileReader.onerror=(error)=>{
            reject(error);
        }
    })
}