import api from '../api/items'
import React, { useEffect, useState } from 'react'

import HeaderAll from './HeaderAll'
import { Link, useNavigate } from "react-router-dom"

const FormShowData = () => {
    const navigate = useNavigate()

    const userId: any = localStorage.getItem('Main_user_id')
    const [userData, setUserData] = useState<any>()

    const GetUserDep = async () => {
        console.log(userId)
        let bodyFormData = new FormData();
        bodyFormData.append('user_id', userId);
        const response = await api.post(`/postSystem/get_user_dep.php`, bodyFormData
            , { headers: { 'Content-Type': 'multipart/form-data' } })
        console.log(response.data[0])
        setUserData(response.data[0])
        response.data[0] && response.data[0].role === `1` ? navigate(`/Distributer`) : response.data[0].role === `3` ? navigate(`/FormShowData`) : response.data[0].role === `0` ? navigate(`/Consumer`) : navigate(`/Consumer`)
    }

    const [Incomes, setIncomes] = useState<any>([])
    const getIncomesData = async () => {
        const response = await api.get(`/postSystem/get_incomes.php`)
        setIncomes(response.data)
        console.log(response.data)
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

    useEffect(() => {
        if (localStorage.getItem(`Main_user_id`) === null) {
            navigate(`/`)
        } else {
            GetUserDep()
            getIncomesData()
            getSecretState()
            getUrgentState()
        }
    }, [navigate])
    return (
        <div className='max-w-[100%] m-auto p-4 h-[100%] overflow-scroll'>
            <HeaderAll userData={userData} />
            <div className="flex flex-col">
                <div className='flex flex-row-reverse'>
                <Link to={`/Form`}>
                    <button className={`border bg-[#05351b] shadow-lg p-2 px-5 rounded-md min-w-0 mt-2 text-center text-white font-bold  active:bg-white active:text-[#05351b]`}>عودة {"\u2B9E"} </button>
                </Link>
                </div>
                <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
                    <div className="py-2 inline-block min-w-full sm: lg:px-8">
                        <div className=" overflow-y-auto h-[450px]">
                            <table className="min-w-full text-center">
                                <thead className="border-b sticky bg-[#05351b]">
                                    <tr>
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
                                                <tr key={index} className="bg-[#8a8989] border-b-[2px] border-[black]">

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
        </div>
    )
}

export default FormShowData
