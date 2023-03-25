import React, { useEffect, useState } from 'react'
import api from '../api/items'
import HeaderAll from './HeaderAll'
import { Link, useNavigate } from "react-router-dom"
import { toast, Zoom } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';



const FormPage = () => {
    const navigate = useNavigate()

    const [disable,setDisable]=useState<any>(false)

    const [processNumber, setProcessNumber] = useState('')
    const [processDescription, setProcessDescription] = useState('')
    const [processDate, setProcessDate] = useState('')
    const [processSide, setProcessSide] = useState('')
    const [processData, setProcessData] = useState<File | Blob | string | any>()
    const [processSecret, setProcessSecret] = useState('0')
    const [processUrgent, setProcessUrgent] = useState('0')

    // const [fileName, setFileName] = useState('')
    const [SecretStatusArray, setSecretStatusArray] = useState([])
    const getSecretState = async () => {
        const response = await api.get(`/postSystem/secrets_degree.php`)
        setSecretStatusArray(response.data)
    }

    const [UrgentStatusArray, setUrgentStatusArray] = useState([])
    const getUrgentState = async () => {
        const response = await api.get(`/postSystem/priority.php`)
        setUrgentStatusArray(response.data)
    }

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
        response.data[0] && response.data[0].role === `1` ? navigate(`/Distributer`) : response.data[0].role === `3` ? navigate(`/Form`) : response.data[0].role === `0` ? navigate(`/Consumer`) : navigate(`/Consumer`)
    }

    useEffect(() => {
        if (localStorage.getItem(`Main_user_id`) === null) {
            navigate(`/`)
        } else {
            GetUserDep()
            getSecretState()
            getUrgentState()
        }
    }, [navigate])



    // const [base, setBase] = React.useState('');


    const changeProcessNumber = (e: React.ChangeEvent<HTMLInputElement>) => { setProcessNumber(e.target.value) }
    const changeProcessDescription = (e: React.ChangeEvent<HTMLInputElement>) => { setProcessDescription(e.target.value) }
    const changeProcessDate = (e: React.ChangeEvent<HTMLInputElement>) => { setProcessDate(e.target.value) }
    const changeProcessSide = (e: React.ChangeEvent<HTMLInputElement>) => { setProcessSide(e.target.value) }
    const changeProcessSecret = (e: React.ChangeEvent<HTMLSelectElement>) => { setProcessSecret(e.target.value) }
    const changeProcessUrgent = (e: React.ChangeEvent<HTMLSelectElement>) => { setProcessUrgent(e.target.value) }

    const changeProcessData = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files
        if (!selectedFile) return;
        // setProcessData(selectedFile[0])

        if (selectedFile.length > 0) {
            let fileToLoad = selectedFile[0];
            console.log(fileToLoad)
            // setFileName(fileToLoad.name)

            let fileReader: FileReader = new FileReader();
            let base64;
            fileReader.onload = (e: any) => {
                base64 = e.target.result.split(",")[1];
                console.log(base64);
                setProcessData(base64)
            };
            fileReader.readAsDataURL(fileToLoad);
        }
    }

    const Submit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setDisable(true)

        let TestRepeatedIncome = new FormData();
        TestRepeatedIncome.append('Income_No', processNumber);
        const Repeatedresponse = await api.post(`/postSystem/get_income_repeated.php`, TestRepeatedIncome, { headers: { 'Content-Type': 'multipart/form-data' } })

        if (Repeatedresponse.data.length > 0) {
            notifyFail()
        } else {
            let bodyFormData = new FormData();
            bodyFormData.append('Income_No', processNumber);
            bodyFormData.append('Income_Subject', processDescription);
            bodyFormData.append('degree_Of_Security', processSecret);
            bodyFormData.append('degree_Of_Priority', processUrgent);
            bodyFormData.append('from_depart', processSide);
            bodyFormData.append('Income_Date', processDate);
            bodyFormData.append('from_user_id', userId);
            await api.post(`/postSystem/insert_inc_details.php`, bodyFormData
                , { headers: { 'Content-Type': 'multipart/form-data' } })

            let InsertPdf = new FormData();
            InsertPdf.append('Income_ID', processNumber);
            InsertPdf.append('income_document', processData);
            await api.post(`/postSystem/insert_inc_doc.php`, InsertPdf
                , { headers: { 'Content-Type': 'multipart/form-data' } })

            let MakeCopyServerPdf = new FormData();
            MakeCopyServerPdf.append('Income_ID', processNumber);
            await api.post(`/postSystem/get_inc_doc.php`, MakeCopyServerPdf, { headers: { 'Content-Type': 'multipart/form-data' } })

            console.log({
                processNumber,
                processDescription,
                processDate,
                processSide,
                processData,
                processSecret,
                processUrgent
            })
            notifySuccess()
        }
        setProcessNumber('')
        setProcessDate('')
        setProcessSide('')
        setProcessDescription('')
        setProcessSecret('0')
        setProcessUrgent('0')

        setDisable(false)
    }

    const notifyFail = () => {
        toast.error(<><p className='text-white font-bold text-lg'>برجاء تغيير رقم المعامله</p></>, {
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

    const notifySuccess = () => {
        toast.success(<><p className='text-white font-bold text-lg'>تم إرسال الوارد للمستوى الأعلى</p></>, {
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
        <div className=' m-auto p-4 h-screen'>
            <HeaderAll userData={userData} />
            <div className='w-[50%] inline-block '>
                <div className='flex flex-row justify-around items-center gap-[20px] mb-[20px]'>
                <Link to={`/FormShowData`}>
                <button  className={`border bg-[#05351b] shadow-lg p-3 w-[200px] mt-2 text-center text-white font-bold  active:bg-white active:text-[#05351b]`}>عرض جميع خطابات الوارد</button>
                </Link>
                <h1 className='text-2xl font-bold text-center p-4'>الــــوارد</h1>
                </div>
                <form onSubmit={Submit} className=' m-auto'>
                    <input onChange={changeProcessNumber} value={processNumber} className='border-2 border-black  shadow-lg p-3 w-full text-end' type="text" placeholder='رقم المعامله' />
                    <input onChange={changeProcessDescription} value={processDescription} className='border-2 border-black shadow-lg p-3 w-full my-2 text-end' type="text" placeholder='موضوع المعامله' />
                    <input onChange={changeProcessDate} value={processDate} className='border-2 border-black shadow-lg p-3 w-full my-2 text-end' type="date" />
                    <input onChange={changeProcessSide} value={processSide} className='border-2 border-black shadow-lg p-3 w-full my-2 text-end' type="text" placeholder='وارد من جهه' />
                    <input onChange={changeProcessData}  className='border-2 border-black shadow-lg p-3 w-full my-2 text-end' type="file" accept='.pdf' />
                    <div className='w-[50%] inline-block ' >
                        <select value={processSecret} onChange={changeProcessSecret} id='Secret' className='border-2 font-bold border-black rounded-[12px] shadow-lg p-1 my-2 text-center'>
                            {SecretStatusArray.length > 0 && SecretStatusArray.map((item: any, index) => {
                                return (
                                    <option key={index} value={item.degree_id}>{item.degree_desc}</option>
                                )
                            })}
                        </select>
                        <label htmlFor="Secret" className='ml-[1.5rem]'>درجة السرية</label>
                    </div>
                    <div className='w-[50%] inline-block'>
                        <select value={processUrgent} onChange={changeProcessUrgent} id='Urgent' className='border-2 font-bold border-black rounded-[12px] shadow-lg p-1 my-2 text-center' >
                            {UrgentStatusArray.length > 0 && UrgentStatusArray.map((item: any, index) => {
                                return (
                                    <option key={index} value={item.prority_id}>{item.prority_desc}</option>
                                )
                            })}
                        </select>
                        <label htmlFor="Urgent" className='ml-[1.5rem]'>درجة الاسبقية</label>
                    </div>
                    <button disabled={disable?true:false} className={`border ${disable ? `bg-[#630808]` : `bg-[#05351b]`}  shadow-lg p-3 w-full mt-2 text-center text-white font-bold  active:bg-white active:text-[#05351b]`} type='submit'>إرسال</button>
                </form>
            </div>
            {/* <div className='inline-block p-4 '> */}
            {/* {processData ? <embed src={`data:application/pdf;base64,${processData}`} width="500px" height="500px"></embed> : ``} */}
            {/* <embed src={`http://localhost:80//postSystem/test.pdf`} width="500px" height="500px"></embed> */}
            {/* {fileName ? <embed src={`http://localhost:80//postSystem/${fileName}`} width="500px" height="500px"></embed> : ``} */}
            {/* </div> */}
        </div>
    )
}

export default FormPage
