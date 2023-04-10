import React, { useEffect, useState } from 'react'
import { useNavigate } from "react-router-dom"

import api from '../api/items'
import HeaderAll from './HeaderAll'



const ConsumerPage = () => {
    const navigate = useNavigate()


    const [unreadCounter, setUnreadCounter] = useState<any>(0)
    const [unreadNotificationIncome, setUnreadNotificationIncome] = useState<any>([])
    const [DataIncomes, setDataIncomes] = useState<any>([])
    const Click = (ProcessNum: string) => {

        window.open(`http://localhost:80/postSystem/${ProcessNum}.pdf`)
    }

    const userId: any = localStorage.getItem('Main_user_id')
    const [userData, setUserData] = useState<any>()
    // const [userParentData, setUserParentData] = useState<any>()
    const [userChildrenData, setUserChildrenData] = useState<any>()


    const GetUserDep = async () => {
        // console.log(userId)
        let bodyFormData = new FormData();
        bodyFormData.append('user_id', userId);
        const response = await api.post(`/postSystem/get_user_dep.php`, bodyFormData
            , { headers: { 'Content-Type': 'multipart/form-data' } })
        // console.log(response.data[0])
        setUserData(response.data[0])
        response.data[0] && response.data[0].role === `1` ? navigate(`/Distributer`) : response.data[0].role === `3` ? navigate(`/Form`) : response.data[0].role === `0` ? navigate(`/Consumer`) : console.log(`aa`)

        // ///Parent Data
        // let bodyParentFormData = new FormData();
        // bodyParentFormData.append('depart_id', response.data[0].depart_id);
        // const ParentResponse = await api.post(`/postSystem/get_depart-parent_id.php`, bodyParentFormData
        //     , { headers: { 'Content-Type': 'multipart/form-data' } })
        // setUserParentData(ParentResponse.data[0].depart_parent_id)


        //Children

        let bodyChildrenFormData = new FormData();
        bodyChildrenFormData.append('depart_id', response.data[0].depart_id);
        const ChildrenResponse = await api.post(`/postSystem/get_temp_users.php`, bodyChildrenFormData
            , { headers: { 'Content-Type': 'multipart/form-data' } })
        // console.log(ChildrenResponse.data)
        setUserChildrenData(ChildrenResponse.data)
    }




    const [SecretStatusArray, setSecretStatusArray] = useState<any>([])
    const getSecretState = async () => {
        const response = await api.get(`/postSystem/secrets_degree.php`)
        setSecretStatusArray(response.data)
    }

    const [UrgentStatusArray, setUrgentStatusArray] = useState<any>([])
    const getUrgentState = async () => {
        const response = await api.get(`/postSystem/priority.php`)
        setUrgentStatusArray(response.data)
    }


    const getDataIncomes = async () => {
        let bodyFormData = new FormData();
        bodyFormData.append('user_id', userId);
        const UserResponse = await api.post(`/postSystem/get_user_dep.php`, bodyFormData
            , { headers: { 'Content-Type': 'multipart/form-data' } });
        const userResponse1 =  UserResponse.data[0]  
        let depData = new FormData();
        depData.append('depart_id', userResponse1.depart_id);

        const response = await api.post(`/postSystem/get_manager_assigned_income.php`, depData
            , { headers: { 'Content-Type': 'multipart/form-data' } })
        setDataIncomes(response.data)
        setUnreadNotificationIncome(response.data.filter((inc: any) => inc.notification_read == 0))
        setUnreadCounter(response.data.filter((inc: any) => inc.notification_read == 0).length);
    }

    const [textArea, setTextArea] = useState<any>()

    const Update = async (IncomeId: any, DepID: any, textArea: any) => {
        let UpdateData = new FormData();
        UpdateData.append('Income_ID', IncomeId);
        UpdateData.append('Assigned_To', DepID);
        UpdateData.append('Action_text', textArea);
        const response = await api.post(`/postSystem/insert_manager_asigned_income.php`, UpdateData
            , { headers: { 'Content-Type': 'multipart/form-data' } })
        // console.log(response.data)

        //ٌRender Data Incomes
        getDataIncomes()


    }



    useEffect(() => {
        if (localStorage.getItem(`Main_user_id`) === null) {
            navigate(`/`)
        } else {
            getSecretState()
            getUrgentState()
            GetUserDep()
            getDataIncomes()
             const  number = setInterval(() => {
                // Send GET request to PHP script to check for new notifications
                getDataIncomes()
              },5000); 
        }
    }, [navigate])

    const [showThirdModal, setShowThirdModal] = useState(false);
    const [MangerDirOrderShow,setMangerDirOrderShow]=useState<any>()
    const ShowManagerDirectory = (Income_No:any)=>{
        setShowThirdModal(true)
        setMangerDirOrderShow(userData !== undefined && DataIncomes.filter((DataItem: any) => DataItem.Assigned_To === userData.depart_id && DataItem.Income_No === Income_No)[0])
        // console.log(MangerDirOrderShow)
    }

    return (
        <div className='max-w-[100%] m-auto p-4 h-[100%]'>
            <HeaderAll NotificationIncome={unreadNotificationIncome} userData={userData} userChildrenData={userChildrenData} />
            <div className="flex flex-col">
                <div className="overflow-x-auto ">
                    <div className="py-4 inline-block min-w-full ">
                        <div className="overflow-y-auto h-[450px]">
                            <table className="min-w-full text-center">
                                <thead className="border-b sticky bg-[#05351b]">
                                    <tr>
                                        <th scope="col" className="text-md font-medium text-white px-6 py-4">
                                            التوجية
                                        </th>
                                        <th scope="col" className="text-md font-medium text-white px-6 py-4">
                                            الإجراء المتخذ
                                        </th>
                                        <th scope="col" className="text-md font-medium text-white px-6 py-4">
                                            توجية المدير
                                        </th>
                                        <th scope="col" className="text-md font-medium text-white px-6 py-4">
                                            الإجراء المطلوب
                                        </th>
                                        <th scope="col" className="text-md font-medium text-white px-6 py-4">
                                            مرسل الى
                                        </th>
                                        <th scope="col" className="text-md font-medium text-white px-6 py-4">
                                            درجة الاسبقية
                                        </th>
                                        <th scope="col" className="text-md font-medium text-white px-6 py-4">
                                            درجة السرية
                                        </th>
                                        <th scope="col" className="text-md font-medium text-white px-6 py-4">
                                            وارد من جهه
                                        </th>
                                        <th scope="col" className="text-md font-medium text-white px-6 py-4">
                                            تاريخ المعاملة
                                        </th>
                                        <th scope="col" className="text-md font-medium text-white px-6 py-4">
                                            موضوع المعامله
                                        </th>
                                        <th scope="col" className="text-md font-medium text-white px-6 py-4">
                                            رقم المعامله
                                        </th>
                                        <th scope="col" className="text-md font-medium text-white px-6 py-4">
                                            م
                                        </th>
                                    </tr>
                                </thead >
                                <tbody>
                                    {
                                        // userParentData !== undefined && userData !== undefined && DataIncomes.filter((DataItem: any) => DataItem.Assigned_To === userData.depart_id || DataItem.Assigned_To === userParentData && userParentData !== `1` && userParentData !== `2` && userParentData !== `3`).length > 0 ? DataIncomes.filter((DataItem: any) => DataItem.Assigned_To === userData.depart_id || DataItem.Assigned_To === userParentData && userParentData !== `1` && userParentData !== `2` && userParentData !== `3`).map((item: any, index: any) => {
                                             userData !== undefined && DataIncomes.length > 0 ? DataIncomes.map((item: any, index: any) => {
                                      
                                            return (
                                                <tr key={index} className={`${item.Action_text===null ? `bg-[#a02222]` : `bg-[#8a8989]` } border-b-[2px] border-[black]`}>
                                                    <td className="px-2 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                        <button disabled={(item.Action_text !== null || userData.role!==`2`) ? true : false}  onClick={() => { Update(item.Income_ID, userData.depart_id, textArea) }} className={`border rounded-[12px] ${(item.Action_text !== null || userData.role!==`2`) ? `bg-[#5bb485]` : `bg-[#05351b]`}  shadow-lg p-[5px] w-content mt-2 text-center text-white font-bold `} >إرسال</button>
                                                    </td>
                                                    <td className=" whitespace-nowrap text-sm  text-gray-900">
                                                        {userData && item.Assigned_To == userData.depart_id && userData.role===`2` && item.Action_text === null ? (<textarea onChange={(e) => { setTextArea(e.target.value) }} className=' bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:border-[#05351b] focus:outline-none text-end' cols={20} rows={2} />) : <p>{item.Action_text}</p>}
                                                    </td>
                                                    <td className="px-2 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                        <button onClick={()=>{ShowManagerDirectory(item.Income_No)}} className={`border rounded-[12px]  bg-[#614405] shadow-lg p-[5px] w-content mt-2 text-center text-white font-bold `} >عرض</button>
                                                    </td>
                                                    <td className="text-sm font-bold text-gray-900  px-2 py-4 whitespace-nowrap">
                                                        {item.action_type}
                                                    </td>
                                                    <td className="text-sm font-bold text-gray-900  px-2 py-4 whitespace-nowrap">
                                                        {item.department_to}
                                                    </td>
                                                    <td className="text-sm font-bold text-gray-900  px-2 py-4 whitespace-nowrap">
                                                        {UrgentStatusArray.length > 0 && UrgentStatusArray[item.degree_Of_Priority - 1].prority_desc}
                                                    </td>
                                                    <td className="text-sm font-bold text-gray-900  px-2 py-4 whitespace-nowrap">
                                                        {SecretStatusArray.length > 0 && SecretStatusArray[item.degree_Of_Security - 1].degree_desc}
                                                    </td>
                                                    <td className="text-sm font-bold text-gray-900  px-2 py-4 whitespace-nowrap">
                                                        {item.register_department_id}
                                                    </td>
                                                    <td className="text-sm font-bold text-gray-900  px-2 py-4 whitespace-nowrap">
                                                        {item.Income_Date.split(" ")[0]}
                                                    </td>
                                                    <td onClick={() => { Click(item.Income_No) }} className="cursor-pointer text-sm font-bold text-gray-900  px-2 py-4 whitespace-nowrap">
                                                        <p className='w-content max-w-[250px] whitespace-normal'>
                                                            {item.Income_Subject}
                                                        </p>
                                                    </td>
                                                    <td className="text-sm font-bold text-gray-900  px-2 py-4 whitespace-nowrap">
                                                        {item.Income_No}
                                                    </td>
                                                    <td className="text-sm font-bold text-gray-900  px-2 py-4 whitespace-nowrap">
                                                        {index + 1}
                                                    </td>
                                                </tr >
                                            )
                                        }) : (<tr className="bg-[#8a8989] border-b-[2px] border-[black]">
                                            <td colSpan={11} className="text-lg font-bold text-gray-900  px-2 py-4 whitespace-nowrap">
                                                <p >لا توجد معاملات للفرع</p>
                                            </td>
                                        </tr>)
                                    }

                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
            {showThirdModal ? (
                <>
                    <div
                        className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
                    >
                        <div className="relative w-[100%] my-6 mx-auto max-w-3xl border-[#05351b] rounded-[12px] border-4">
                            <div className="border-0 rounded-lg  shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                                <p className="text-3xl font-semibold mt-2 mx-auto  text-[#05351b] border-[#05351b] p-2 rounded-[12px] border-2 ">
                                    عرض توجية المدير
                                </p>
                                <div className="relative px-6 flex-auto">
                                    <div className="my-4 font-bold text-sm overflow-y-auto ">
                                    <p className='text-lg font-bold text-[#05351b] '>{MangerDirOrderShow.manager_assigned_text!==null ? MangerDirOrderShow.manager_assigned_text : `لا يوجد توجية من المدير`}</p>
                                    </div>
                                </div>
                                <div className="flex items-center justify-end px-6 pb-6 ">
                                    <button
                                        className="text-white bg-[#6e1212] active:bg-white active:text-[#6e1212] font-bold uppercase px-6 py-2 rounded text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                        type="button"
                                        onClick={() => { setShowThirdModal(false) }}
                                    >
                                        غلق
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
                </>
            ) : null}
        </div>
    )
}

export default ConsumerPage
