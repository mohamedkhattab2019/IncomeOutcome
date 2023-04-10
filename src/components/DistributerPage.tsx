import React, { useEffect, useState } from 'react'
import api from '../api/items'
import { useNavigate } from "react-router-dom"
import HeaderAll from './HeaderAll'


const DistributerPage = () => {
    const navigate = useNavigate()
    const [showModal, setShowModal] = useState(false);
    const [showSecondModal, setShowSecondModal] = useState(false);

    const [IncomeCodeClicked, setIncomeCodeClicked] = useState<any>()
    const [IncomeIdClicked, setIncomeIdClicked] = useState<any>()

    const [SelectedDep, setSelectedDep] = useState<any>(1)
    const changeDep = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedDep(e.target.value)
        console.log(SelectedDep)
    }
    const [SelectedAction, setAction] = useState<any>(1)
    const changeAction = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setAction(e.target.value)
        console.log(SelectedAction)
    }
    const [textArea, setTextArea] = useState<any>()

    const [AddArray, setAddArray] = useState<any>([])
    const AddToArray = () => {
        setAddArray([...AddArray, { SelectedAction, SelectedDep, textArea }])
        setTextArea(``)
    }

    const [managerUnSeenNotificationIncome, setUnSeenNotificationIncome] = useState<any>([])


    const [Incomes, setIncomes] = useState<any>([])
    const getIncomesData = async () => {
        const response = await api.get(`/postSystem/get_incomes.php`)
        setIncomes(response.data)
        console.log(response.data)
        setUnSeenNotificationIncome(response.data.filter((inc: any) => inc.seen_by_manager == 0))

    }

    const [SecretStatusArray, setSecretStatusArray] = useState<any>([])
    const getSecretState = async () => {
        const response = await api.get(`/postSystem/secrets_degree.php`)
        setSecretStatusArray(response.data)
        console.log(response.data)
    }

    const [UrgentStatusArray, setUrgentStatusArray] = useState<any>([])
    const getUrgentState = async () => {
        const response = await api.get(`/postSystem/priority.php`)
        setUrgentStatusArray(response.data)
    }

    const Click = (ProcessNum: string) => {
        window.open(`http://localhost:80/postSystem/${ProcessNum}.pdf`)
    }

    const AddClick = (ProcessNumber: any, Income_ID: any) => {
        setShowModal(true)
        setIncomeCodeClicked(ProcessNumber)
        setIncomeIdClicked(Income_ID)
    }

    const Send = async () => {
        setShowModal(false)
        let DepArr: any = [];
        let ActionArr: any = [];
        let TextAreaArr: any = [];
        AddArray.map((item: any) => {
            DepArr.push(item.SelectedDep)
            ActionArr.push(item.SelectedAction)
            TextAreaArr.push(item.textArea)
        })
        let SendFormData = new FormData();
        SendFormData.append('Income_ID', IncomeIdClicked);
        SendFormData.append('Assigned_From', userData.depart_id);
        SendFormData.append('Assigned_To', DepArr);
        SendFormData.append('Action_Type', ActionArr);
        SendFormData.append('manager_assigned_text', TextAreaArr);
        console.log(SendFormData)
        const response = await api.post(`/postSystem/insert_manager_asigned_income.php`, SendFormData
            , { headers: { 'Content-Type': 'multipart/form-data' } })
        console.log(response.data)

        setAddArray([])
    }

    const close = () => {
        setShowModal(false)
        setAddArray([])
    }

    const deleteItem = (itemIndex: any) => {
        setAddArray(AddArray.filter((item: any, index: any) => index !== itemIndex))
        console.log(AddArray)
    }

    const [DepartmentsArray, setDepartmentsArray] = useState<any>([])
    const getDepartments = async () => {
        const response = await api.get(`/postSystem/departments.php`)
        setDepartmentsArray(response.data)
        console.log(response.data)
    }

    const [ActionTypeArray, setActionTypeArray] = useState<any>([])
    const getActionType = async () => {
        const response = await api.get(`/postSystem/action_type.php`)
        setActionTypeArray(response.data)
        console.log(response.data)
    }

    const userId: any = localStorage.getItem('Main_user_id')
    const [userData, setUserData] = useState<any>()
    const [userChildrenData, setUserChildrenData] = useState<any>()


    const GetUserDep = async () => {
        console.log(userId)
        let bodyFormData = new FormData();
        bodyFormData.append('user_id', userId);
        const response = await api.post(`/postSystem/get_user_dep.php`, bodyFormData
            , { headers: { 'Content-Type': 'multipart/form-data' } })
        console.log(response.data[0])
        setUserData(response.data[0])
        response.data[0] && response.data[0].role === `1` ? navigate(`/Distributer`) : response.data[0].role === `3` ? navigate(`/Form`) : response.data[0].role === `0` ? navigate(`/Consumer`) : console.log(`aa`)


        //Children
        let bodyChildrenFormData = new FormData();
        bodyChildrenFormData.append('depart_id', response.data[0].depart_id);
        const ChildrenResponse = await api.post(`/postSystem/get_temp_users.php`, bodyChildrenFormData
            , { headers: { 'Content-Type': 'multipart/form-data' } })
        console.log(ChildrenResponse.data)
        setUserChildrenData(ChildrenResponse.data)
        
    }
    const [ShowData, setShowData] = useState<any>([])

    const getShowData = async (incomeID: any) => {
        let ShowFormData = new FormData();
        ShowFormData.append('Income_ID', incomeID);
        const response = await api.post(`/postSystem/get_manager_assigned_income.php`, ShowFormData
            , { headers: { 'Content-Type': 'multipart/form-data' } })
        console.log(response.data)
        setShowData(response.data)
    }

    const ShowButton = (incomeID: any) => {
        setShowSecondModal(true)
        getShowData(incomeID)
    }


    useEffect(() => {
        if (localStorage.getItem(`Main_user_id`) === null) {
            navigate(`/`)
        } else {
            getSecretState()
            getUrgentState()
            getIncomesData()
            GetUserDep()
            getDepartments()
            getActionType()
            const  number = setInterval(() => {
                // Send GET request to PHP script to check for new notifications
                getIncomesData()
              },5000); 
        }
    }, [navigate])


    return (
        <div className='max-w-[100%] m-auto p-4 h-[100%] overflow-scroll'>
            <HeaderAll  NotificationIncome={managerUnSeenNotificationIncome} userData={userData} userChildrenData={userChildrenData} />
            <div className="flex flex-col">
                <div className="overflow-x-auto ">
                    <div className="py-4 inline-block min-w-full ">
                        <div className=" overflow-y-auto h-[450px]">
                            <table className="min-w-full text-center">
                                <thead className="border-b sticky bg-[#05351b]">
                                    <tr>
                                        <th scope="col" className="text-md font-medium text-white px-6 py-4">
                                            التوجية
                                        </th>
                                        <th scope="col" className="text-md font-medium text-white  py-4">
                                            درجة الاسبقية
                                        </th>
                                        <th scope="col" className="text-md font-medium text-white  py-4">
                                            درجة السرية
                                        </th>
                                        <th scope="col" className="text-md font-medium text-white  py-4">
                                            وارد من جهه
                                        </th>
                                        <th scope="col" className="text-md font-medium text-white  py-4">
                                            تاريخ المعاملة
                                        </th>
                                        <th scope="col" className="text-md font-medium text-white  py-4">
                                            موضوع المعامله
                                        </th>
                                        <th scope="col" className="text-md font-medium text-white  py-4">
                                            رقم المعامله
                                        </th>
                                        <th scope="col" className="text-md font-medium text-white px-6 py-4">
                                            م
                                        </th>
                                    </tr>
                                </thead >
                                <tbody>
                                    {
                                        Incomes.length > 0 && Incomes.map((item: any, index: any) => {
                                            return (
                                                <tr key={index} className={`${item.Action_text===null ? `bg-[#a02222]` : `bg-[#8a8989]` }  border-b-[2px] border-[black]`}>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                        <button onClick={() => { ShowButton(item.Income_ID) }} className='border rounded-[12px] bg-[#614405] shadow-lg p-[10px] w-content  text-center text-white font-bold ' >عرض</button>
                                                        <button onClick={() => AddClick(item.Income_No, item.Income_ID)} className='border rounded-[12px] bg-[#0e1555] shadow-lg p-[10px] w-content ml-2  text-center text-white font-bold ' >إضافه</button>
                                                    </td>
                                                    <td className="text-sm font-bold text-gray-900   py-4 whitespace-nowrap">
                                                        {UrgentStatusArray.length > 0 && UrgentStatusArray[item.degree_Of_Priority - 1].prority_desc}
                                                    </td>
                                                    <td className="text-sm font-bold text-gray-900   py-4 whitespace-nowrap">
                                                        {SecretStatusArray.length > 0 && SecretStatusArray[item.degree_Of_Security - 1].degree_desc}
                                                    </td>
                                                    <td className="text-sm font-bold text-gray-900   py-4 whitespace-nowrap">
                                                        {item.from_depart}
                                                    </td>
                                                    <td className="text-sm font-bold text-gray-900   py-4 whitespace-nowrap">
                                                        {item.Income_Date.split(" ")[0]}
                                                    </td>
                                                    <td onClick={() => { Click(item.Income_No) }} className="cursor-pointer text-sm font-bold text-gray-900   py-4 whitespace-nowrap">
                                                        <p className='w-content max-w-[250px] whitespace-normal'>
                                                            {item.Income_Subject}
                                                        </p>
                                                    </td>
                                                    <td className="text-sm font-bold text-gray-900   py-4 whitespace-nowrap">
                                                        {item.Income_No}
                                                    </td>
                                                    <td className="text-sm font-bold text-gray-900  px-6 py-4 whitespace-nowrap">
                                                        {index + 1}
                                                    </td>
                                                </tr >
                                            )
                                        })
                                    }
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
            {showModal ? (
                <>
                    <div
                        className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
                    >
                        <div className="relative w-[100%] my-6 mx-auto max-w-3xl border-[#05351b] rounded-[12px] border-4">
                            <div className="border-0 rounded-lg  shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                                <p className="text-3xl font-semibold mt-2 mx-auto  text-[#05351b] border-[#05351b] p-2 rounded-[12px] border-2 ">
                                    توجيه الإرسال و الإجراء
                                </p>
                                <div className="relative px-6 flex-auto">
                                    <div className="my-4 flex items-center justify-around  ">
                                        <button onClick={AddToArray}
                                            className="bg-[#05351b] text-white active:bg-white active:text-[#05351b] font-bold text-md p-2 rounded-full shadow "
                                        >
                                            إضافه
                                        </button>
                                        <textarea value={textArea} onChange={(e) => { setTextArea(e.target.value) }} placeholder='إضافه توجية' className=' bg-white  font-bold border-black rounded-[12px]  transition ease-in-out p-1 text-end' cols={20} rows={2} />
                                        <select onChange={changeAction} className=' border-2 font-bold border-black rounded-[12px] shadow-lg p-1 my-2 text-center' >
                                            <option value={1}>الإجراء</option>

                                            {
                                                ActionTypeArray.length > 0 && ActionTypeArray.map((item: any, index: any) => {
                                                    return (
                                                        <option key={index} value={item.Action_Type_ID}>{item.Action_Type_Name}</option>
                                                    )
                                                })
                                            }
                                        </select>
                                        <select onChange={changeDep} className=' border-2 font-bold border-black rounded-[12px] shadow-lg p-1 my-2 text-center' >
                                            <option value={1}>يرسل الى</option>
                                            {
                                                DepartmentsArray.length > 0 && DepartmentsArray.filter((itemData: any) => itemData.for_drop_box === `1`).map((item: any, index: any) => {
                                                    return (
                                                        <option key={index} value={item.depart_id}>{item.department}</option>
                                                    )
                                                })
                                            }
                                        </select>
                                    </div>
                                    <div className="my-4 font-bold text-sm overflow-y-auto h-[300px] ">
                                        <table className="min-w-full text-center border-[#05351b] rounded-[12px] border-4">
                                            <thead className="border-b bg-[#05351b]">
                                                <tr>
                                                    <th scope="col" className="text-md font-medium text-white px-6 py-4">
                                                        توجيه
                                                    </th>
                                                    <th scope="col" className="text-md font-medium text-white px-6 py-4">
                                                        الإجراء
                                                    </th>
                                                    <th scope="col" className="text-md font-medium text-white px-6 py-4">
                                                        شرح
                                                    </th>
                                                    <th scope="col" className="text-md font-medium text-white px-6 py-4">
                                                        يرسل الى
                                                    </th>
                                                    <th scope="col" className="text-md font-medium text-white px-6 py-4">
                                                        م
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {
                                                    AddArray.length > 0 && (
                                                        AddArray.map((item: any, index: any) => {
                                                            return (
                                                                <tr key={index} className="bg-[#8a8989] border-b-[2px] border-[black]">
                                                                    <td className="text-sm font-bold text-gray-900   py-4 whitespace-nowrap">
                                                                        <button
                                                                            className="text-white bg-[#6e1212] active:bg-white active:text-[#6e1212] font-bold uppercase px-6 py-2 rounded text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                                                            type="button"
                                                                            onClick={() => { deleteItem(index) }}
                                                                        >
                                                                            حذف
                                                                        </button>
                                                                    </td>

                                                                    <td className="text-sm font-bold text-gray-900 py-4 ">
                                                                        <p className='w-content max-w-[150px]  py-4 '>
                                                                        {item.textArea}
                                                                        </p>
                                                                    </td>

                                                                    <td className="text-sm font-bold text-gray-900   py-4 whitespace-nowrap">
                                                                        {ActionTypeArray.length > 0 ? ActionTypeArray[item.SelectedAction - 1].Action_Type_Name : ``}
                                                                    </td>

                                                                    <td className="text-sm font-bold text-gray-900   py-4 whitespace-nowrap">
                                                                        {DepartmentsArray.length > 0 ? DepartmentsArray[item.SelectedDep - 1].department : ``}
                                                                    </td>
                                                                    <td className="text-sm font-bold text-gray-900   py-4 whitespace-nowrap">
                                                                        {index + 1}
                                                                    </td>
                                                                </tr>
                                                            )
                                                        })
                                                    )
                                                }
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                                <div className="flex items-center justify-end px-6 pb-6 ">
                                    <button
                                        className="text-white bg-[#6e1212] active:bg-white active:text-[#6e1212] font-bold uppercase px-6 py-2 rounded text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                        type="button"
                                        onClick={close}
                                    >
                                        غلق
                                    </button>
                                    <button
                                        className="bg-[#05351b] text-white active:bg-white active:text-[#05351b] font-bold uppercase text-sm px-6 py-2 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                        type="button"
                                        onClick={Send}
                                    >
                                        إرسال
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
                </>
            ) : null}
            {showSecondModal ? (
                <>
                    <div
                        className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
                    >
                        <div className="relative w-[100%] my-6 mx-auto max-w-3xl border-[#05351b] rounded-[12px] border-4">
                            <div className="border-0 rounded-lg  shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                                <p className="text-3xl font-semibold mt-2 mx-auto  text-[#05351b] border-[#05351b] p-2 rounded-[12px] border-2 ">
                                    عرض الإرسال و الإجراء
                                </p>
                                <div className="relative px-6 flex-auto">
                                    <div className="my-4 font-bold text-sm overflow-y-auto h-[300px] ">
                                        <table className="min-w-full text-center border-[#05351b] rounded-[12px] border-4">
                                            <thead className="border-b bg-[#05351b]">
                                                <tr>
                                                    <th scope="col" className="text-md font-medium text-white px-6 py-4">
                                                        الإجراء المتخذ
                                                    </th>
                                                    <th scope="col" className="text-md font-medium text-white px-6 py-4">
                                                        توجية المدير 
                                                    </th>
                                                    <th scope="col" className="text-md font-medium text-white px-6 py-4">
                                                        الإجراء
                                                    </th>
                                                    <th scope="col" className="text-md font-medium text-white px-6 py-4">
                                                        يرسل الى
                                                    </th>
                                                    <th scope="col" className="text-md font-medium text-white px-6 py-4">
                                                        م
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {
                                                    ShowData.length > 0 && (
                                                        ShowData.map((item: any, index: any) => {
                                                            return (
                                                                <tr key={index} className="bg-[#8a8989] border-b-[2px] border-[black]">
                                                                    <td className="text-sm font-bold text-gray-900   py-4 whitespace-nowrap">
                                                                        {item.Action_text !== `NULL` ? item.Action_text : `لم يتم إتخاذ إجراء`}
                                                                    </td>
                                                                    <td className="text-sm font-bold text-gray-900  py-4 ">
                                                                        <p className='w-content max-w-[150px]  py-4'>
                                                                        {item.manager_assigned_text !== `NULL` ? item.manager_assigned_text : `-`}
                                                                        </p>
                                                                    </td>
                                                                    <td className="text-sm font-bold text-gray-900   py-4 whitespace-nowrap">
                                                                        {ActionTypeArray.length > 0 ? ActionTypeArray[item.action_type_id - 1].Action_Type_Name : ``}
                                                                    </td>

                                                                    <td className="text-sm font-bold text-gray-900   py-4 whitespace-nowrap">
                                                                        {DepartmentsArray.length > 0 ? DepartmentsArray[item.Assigned_To - 1].department : ``}
                                                                    </td>
                                                                    <td className="text-sm font-bold text-gray-900   py-4 whitespace-nowrap">
                                                                        {index + 1}
                                                                    </td>
                                                                </tr>
                                                            )
                                                        })
                                                    )
                                                }
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                                <div className="flex items-center justify-end px-6 pb-6 ">
                                    <button
                                        className="text-white bg-[#6e1212] active:bg-white active:text-[#6e1212] font-bold uppercase px-6 py-2 rounded text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                        type="button"
                                        onClick={() => { setShowSecondModal(false) }}
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

export default DistributerPage
