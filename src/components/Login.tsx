import React, { useState } from 'react'
import HeaderLogin from './HeaderLogin'
// import {sha256} from "js-sha256";
import { toast, Zoom } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import api from '../api/items'
import { useNavigate } from "react-router-dom"




const Login = () => {
    const [UserCode, setUserCode] = useState<any>()
    const [Password, setPassword] = useState<any>()

    const navigate = useNavigate()

    // if (localStorage.getItem(`Main_user_id`)===`LSO502`) {
    //     navigate(`/Distributer`)
    // } else if(localStorage.getItem(`Main_user_id`)===`LSO502`) {
    //     navigate(`/Consumer`)
    // }


    const ChangeUserCode = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUserCode(e.target.value)
    }

    const ChangePass = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value)
    }

    const Submit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        // Test UserName with Password if true Complete
        let LoginFormData = new FormData();
        LoginFormData.append('user_id', UserCode);
        LoginFormData.append('pass', Password);
        const LoginresponseData = await api.post(`/postSystem/get_userLogin.php`, LoginFormData
            , { headers: { 'Content-Type': 'multipart/form-data' } })
        console.log(Password)
        console.log(UserCode)
        console.log(LoginresponseData.data)

        let RoleFormData = new FormData();
        RoleFormData.append('user_id', UserCode);
        const RoleResponse = await api.post(`/postSystem/get_user_dep.php`, RoleFormData
            , { headers: { 'Content-Type': 'multipart/form-data' } })
        console.log(RoleResponse.data[0])



        if (LoginresponseData.data[0].user_id && UserCode && Password) {
            localStorage.setItem(`Main_user_id`, UserCode)
            localStorage.setItem(`Main_user_temp`, ``)
            notifySuccess()
            //Navigation
            RoleResponse.data[0].role === `1` ? navigate(`/Distributer`) : RoleResponse.data[0].role === `3` ? navigate(`/Form`) : navigate(`/Consumer`)
        } else {
            notifyFail()
        }
    }

    const notifySuccess = () => {
        toast.success(<><p className='text-white font-bold text-lg'>تم تسجيل الدخول بنجاح</p></>, {
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
            transition: Zoom
        });
    };

    const notifyFail = () => {
        toast.error(<><p className='text-white font-bold text-lg'>يوحد خطأ فى كود المستخدم او كلمه المرور</p></>, {
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
            transition: Zoom
        });
    };



    return (
        <>
            <HeaderLogin />
            <div className='max-w-[100%] m-auto p-4 h-screen'>
                <div className="container px-6 py-12 h-full">
                    <div className="flex justify-center items-center h-full g-6 text-gray-800">
                        <div className="md:w-8/12 lg:w-5/12 lg:ml-20">
                            <form onSubmit={Submit}>
                                <div className="mb-6">
                                    <input
                                        onChange={ChangeUserCode}
                                        type="text"
                                        className="form-control block w-full px-4 py-2 text-xl font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-[#05351b] focus:outline-none text-end"
                                        placeholder="الكود الشخصى"
                                    />
                                </div>
                                <div className="mb-6">
                                    <input
                                        onChange={ChangePass}
                                        type="password"
                                        className="form-control block w-full px-4 py-2 text-xl font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-[#05351b] focus:outline-none text-end"
                                        placeholder="كلمه المرور"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="inline-block px-7 py-3 bg-[#05351b] text-white font-medium text-sm leading-snug uppercase rounded shadow-md  hover:shadow-lg focus:shadow-lg focus:outline-none focus:ring-0 active:bg-white active:text-[#05351b] active:shadow-lg transition duration-150 ease-in-out w-full"
                                    data-mdb-ripple="true"
                                    data-mdb-ripple-color="light"
                                >
                                    تسجيل الدخول
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Login
