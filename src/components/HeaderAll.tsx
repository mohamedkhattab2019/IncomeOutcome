import React, { useEffect, useState } from 'react'
import { useNavigate } from "react-router-dom"
import { toast, Zoom } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import api from '../api/items'




const HeaderAll = ({ userData, userChildrenData }: any): JSX.Element => {
    console.log(userData && userData)
    const navigate = useNavigate()
    console.log(userChildrenData)

    const [HasMyAuthNames, setHasMyAuthNames] = useState<any>()
    const UserId:any= localStorage.getItem(`Main_user_id`)
    const HasMyAuth = async () => {
        let bodyHasAuthFormData = new FormData();
         bodyHasAuthFormData.append('user_id', UserId && UserId);
        const HasAuthResponse = await api.post(`/postSystem/who_has_my_auth.php`, bodyHasAuthFormData
            , { headers: { 'Content-Type': 'multipart/form-data' } })
        console.log(HasAuthResponse.data)
        setHasMyAuthNames(HasAuthResponse.data)
    }

    const getTempData = async () => {
        let bodySwitchParentFormData = new FormData();
        bodySwitchParentFormData.append('user_id', UserId && UserId);
        const SwitchResponse = await api.post(`/postSystem/get_temp_user_id.php`, bodySwitchParentFormData
            , { headers: { 'Content-Type': 'multipart/form-data' } })
        setTempUserData(SwitchResponse.data[0])

        ///Site Name
        if(SwitchResponse.data[0].user_temp_id!==null){
            let bodyTempSiteNameFormData = new FormData();
            bodyTempSiteNameFormData.append('user_id', SwitchResponse.data[0].user_temp_id);
            const TempSitenameResponse = await api.post(`/postSystem/temp_site_name.php`, bodyTempSiteNameFormData
                , { headers: { 'Content-Type': 'multipart/form-data' } })
    
                console.log(TempSitenameResponse.data)
            setTempSiteName(TempSitenameResponse.data[0].user_name)
        }else{

        }
    }

    useEffect(() => {
        getTempData()
        HasMyAuth()
    }, [])

    const Signout = () => {
        localStorage.removeItem(`Main_user_id`)
        localStorage.removeItem(`Main_user_temp`)
        notifyFail()
        navigate(`/`)
    }

    const DeleteAuth = async (UserId:any)=>{
        let bodySwitchFormData = new FormData();
        bodySwitchFormData.append('user_id', UserId);
        await api.post(`/postSystem/update_temp_user_id.php`, bodySwitchFormData, { headers: { 'Content-Type': 'multipart/form-data' } })

        setHasMyAuthNames(HasMyAuthNames.filter((item:any)=>item.user_id !== UserId))
    }

    const [AuthToChild, setAuthToChild] = useState<any>()

    const GiveAuthToChild = async () => {
        let bodySwitchFormData = new FormData();
        bodySwitchFormData.append('user_id', userData && userData.user_id);
        bodySwitchFormData.append('user_temp_id', AuthToChild);
        await api.post(`/postSystem/update_temp_user_id.php`, bodySwitchFormData, { headers: { 'Content-Type': 'multipart/form-data' } })

        HasMyAuth()
    }

    const [tempUserData, setTempUserData] = useState<any>()
    const [tempSiteName, setTempSiteName] = useState<any>()






    const SwitchToParent = async () => {

        localStorage.setItem(`Main_user_temp`, tempUserData && tempUserData.user_id)

        localStorage.setItem(`Main_user_id`, tempUserData && tempUserData.user_temp_id)

        navigate(0)
    }

    const BackFromManager=()=>{
        const OldUserId:any = localStorage.getItem(`Main_user_temp`) 
        localStorage.setItem(`Main_user_id`, OldUserId && OldUserId)
        localStorage.setItem(`Main_user_temp`, ``)

        navigate(`/Consumer`)
    }

    const Back=()=>{
        const OldUserId:any = localStorage.getItem(`Main_user_temp`) 
        localStorage.setItem(`Main_user_id`, OldUserId && OldUserId)
        localStorage.setItem(`Main_user_temp`, ``)

        navigate(0)
    }


    const notifyFail = () => {
        toast.error(<><p className='text-white font-bold text-lg'>تم تسجيل الخروج</p></>, {
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
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="flex items-center justify-between border-b-2 border-gray-100 pt-2 ">
                <div className="items-center justify-start flex:1">
                    <button onClick={Signout} className=" rounded-[12px] whitespace-nowrap p-2 bg-[#c90b0b] text-white active:bg-white active:text-[#c90b0b]">
                        تسجيل الخروج
                    </button>
                </div>
                <div className=" flex:1">
                    <p className='text-[30px] p-2 font-bold rounded-[12px] border-2 border-[#05351b]  text-[#05351b]'>
                        {userData ? userData.department : ``}
                    </p>
                </div>
                <div className="flex:1 flex flex-col flex-end items-end gap-[5px] ">
                    <div className='flex:1 flex flex-row flex-end items-center justify-center gap-[20px]'>
                        <p className='text-md font-medium text-[#05351b]'>
                            {userData ? userData.user_name : ``}
                        </p>
                        <img
                            className="h-8 w-auto "
                            src="http://localhost:80/postSystem/Avatar.png"
                            alt="Avatar"
                        />
                    </div>
                    {
                        userData && userData.user_id.slice(0, 3) === `LSO` && userData.role !== `1` ? (
                            <div>
                                <div className='flex:1 flex flex-row flex-end items-center justify-center gap-[10px] ' >
                                    <button onClick={GiveAuthToChild} hidden={HasMyAuthNames?.length===1 ? true : false} className=" rounded-[12px] whitespace-nowrap p-1 px-2 bg-[#05351b] text-white">
                                        إعطاء الصلاحية
                                    </button>
                                    <select onChange={(e) => { setAuthToChild(e.target.value) }} id='Role' className='border-2 font-bold text-[#05351b] border-[#05351b] rounded-[12px] shadow-lg p-1 my-2 text-center'>
                                        {userChildrenData && userChildrenData.length > 0 && userChildrenData.map((item: any, index: any) => {
                                            return (
                                                <option key={index} value={item.user_id}>{item.user_name}</option>
                                            )
                                        })}
                                    </select>
                                    <label htmlFor="Role" className='text-lg font-bold text-[#05351b]'>الإنابة</label>
                                </div>
                                {HasMyAuthNames && HasMyAuthNames.length > 0 ? (
                                    <div className='flex:1 flex flex-col gap-[10px] flex-end items-center justify-center border-2 border-[#05351b] rounded-[12px] p-2 ' >
                                            {
                                            HasMyAuthNames.map((item: any, index: any) => {
                                                return (
                                                    <div key={index} className='flex:1 flex flex-row flex-end items-center justify-center'>
                                                        <button onClick={()=>{DeleteAuth(item.user_id)}} className=" rounded-[12px] whitespace-nowrap p-1 px-2 mr-2 bg-[#972a2a] text-white">حذف الإنابة</button>
                                                        <p className='font-bold text-[#05351b]'>{item.user_name}</p>
                                                    </div>
                                                )
                                            })
                                        }
                                    </div>

                                ) : null
                                }
                                {tempUserData && tempUserData.user_temp_id !== null ? (
                                    <div className='flex:1 flex flex-row flex-end items-center justify-end gap-[10px] ' >
                                        <button onClick={SwitchToParent} className=" rounded-[12px] whitespace-nowrap p-1 px-2 bg-[#05351b] text-white">
                                       تحويل الى { tempSiteName && tempSiteName} 
                                        </button>
                                    </div>
                                ) : null}
                                {
                                    localStorage.getItem(`Main_user_temp`)!== `` ? (
                                        <div className='flex:1 flex flex-row flex-end items-center justify-end gap-[10px] ' >
                                        <button onClick={Back} className=" rounded-[12px] whitespace-nowrap p-1 px-2 bg-[#05351b] text-white">
                                            عودة من الصلاحية
                                        </button>
                                    </div>
                                    ):null
                                }

                            </div>
                        ) : userData && userData.role === `1` ? (
                            <div className='flex:1 flex flex-col flex-end items-center justify-center gap-[10px] ' >
                            <div className='flex:1 flex flex-row flex-end items-center justify-center gap-[10px] ' >
                                <button onClick={GiveAuthToChild} hidden={HasMyAuthNames?.length===1 ? true : false} className=" rounded-[12px] whitespace-nowrap p-1 px-2 bg-[#05351b] text-white">
                                    إعطاء الصلاحية
                                </button>
                                <select onChange={(e) => { setAuthToChild(e.target.value) }} id='Role' className='border-2 font-bold text-[#05351b] border-[#05351b] rounded-[12px] shadow-lg p-1 my-2 text-center'>
                                    {userChildrenData && userChildrenData.length > 0 && userChildrenData.map((item: any, index: any) => {
                                        return (
                                            <option key={index} value={item.user_id}>{item.user_name}</option>
                                        )
                                    })}
                                </select>
                                <label htmlFor="Role" className='text-lg font-bold text-[#05351b]'>الإنابة</label>
                                </div>
                                {HasMyAuthNames && HasMyAuthNames.length > 0 ? (
                                    <div className='flex:1 flex flex-col gap-[10px] flex-end items-center justify-center border-2 border-[#05351b] rounded-[12px] p-2 ' >
                                        {
                                            HasMyAuthNames.map((item: any, index: any) => {
                                                return (
                                                    <div key={index} className='flex:1 flex flex-row flex-end items-center justify-center'>
                                                        <button onClick={()=>{DeleteAuth(item.user_id)}} className=" rounded-[12px] whitespace-nowrap p-1 px-2 mr-2 bg-[#972a2a] text-white">حذف الإنابة</button>
                                                        <p className='font-bold text-[#05351b]'>{item.user_name}</p>
                                                    </div>
                                                )
                                            })
                                        }
                                    </div>

                                ) : null
                                }
                                     {
                                    localStorage.getItem(`Main_user_temp`)!== `` ? (
                                        <div className='flex:1 flex flex-row flex-end items-center justify-end gap-[10px] ' >
                                        <button onClick={BackFromManager} className=" rounded-[12px] whitespace-nowrap p-1 px-2 bg-[#05351b] text-white">
                                        عودة من الصلاحية
                                        </button>
                                    </div>
                                    ):null
                                }
                            </div>
                        ) : userData && (userData.user_id.slice(0, 3) === `LSE` || userData.user_id.slice(0, 3) === `LSX`) ? (
                            <div>
                                {tempUserData && tempUserData.user_temp_id !== null ? (
                                    <div className='flex:1 flex flex-row flex-end items-center justify-end gap-[10px] ' >
                                        <button onClick={SwitchToParent} className=" rounded-[12px] whitespace-nowrap p-1 px-2 bg-[#05351b] text-white">
                                        تحويل الى { tempSiteName && tempSiteName} 
                                        </button>
                                    </div>
                                ) : null}
                            </div>
                        ) : (null)
                    }

                </div>
            </div>
        </div>
    )
}
export default HeaderAll
