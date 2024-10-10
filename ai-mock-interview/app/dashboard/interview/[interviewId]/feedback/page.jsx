"use client"
import { db } from '@/utils/db'
import { UserAnswer } from '@/utils/schema'
import { eq } from 'drizzle-orm'
import React, { useEffect, useState } from 'react'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { ChevronsDown, ChevronsUpDown } from 'lucide-react'


function Feedback({params}) {
  const [feedbackList,setFeedbackList] = useState([]);

  useEffect(()=>{
    console.log("Interview ID:", params.interviewId);
   console.log(UserAnswer.mockIdRef, params.interviewId);
    GetFeedback();
  },[])

  const GetFeedback= async()=>{
    
    const result = await db.select()
    .from(UserAnswer)
    .where(eq(UserAnswer.mockIdRef,params.interviewId))
    .orderBy(UserAnswer.id);
    console.log(result);
    setFeedbackList(result);
  }
  return (
    <div className='p-10' >
        <h2 className='text-4xl font-extrabold text-green-500'>Congratulations!</h2>
        <h2 className='font-semibold text-2xl mt-2'>We are excited to share your interview feedback.</h2>
        <h2 className='text-primary text-lg my-4'>Your Overall Interview Rating: <strong>7/10</strong></h2>
        <h2 className='text-lg  bg-primary font-extrabold text-white p-5 rounded-lg shadow-md'>Below, You’ll Find The Interview Questions Along With The Correct Answers, Your Responses, And Feedback for Improvement.</h2>
        {feedbackList&&feedbackList.map((item,index)=>(
          <Collapsible key={index} >
              <CollapsibleTrigger className='p-5 gap-7 flex justify-between bg-secondary rounded-lg font-extrabold  my-2 text-left '>
                 {item.question} <ChevronsDown className='h-5 w-5'/>
              </CollapsibleTrigger>
              <CollapsibleContent>
                 <div className='flex flex-col gap-2'>
                     <h2 className=' p-4 font-semibold  border bg-gray-100/30 rounded-lg'><strong className='text-green-500  font-extrabold '  >Rating : </strong>{item.rating}</h2>
                     <h2  className='border rounded-lg p-4 font-semibold  bg-blue-600/30' > <strong  className='text-primary font-extrabold' >Your Answer : </strong> {item.userAns} </h2>
                     <h2  className='border rounded-lg p-4 font-semibold bg-blue-600/20' > <strong  className='text-primary  font-extrabold' >Correct Answer : </strong> {item.correctAns} </h2>
                     <h2  className='border rounded-lg p-4 font-semibold bg-blue-700/10  ' > <strong  className=' font-extrabold text-primary' >Feedback : </strong> {item.feedback} </h2>
                 </div>
              </CollapsibleContent>
          </Collapsible>
            
        ))}
        
    </div>
  )
}

export default Feedback

// ac356926-f7c0-497f-b527-ce4d8cce0d76/
