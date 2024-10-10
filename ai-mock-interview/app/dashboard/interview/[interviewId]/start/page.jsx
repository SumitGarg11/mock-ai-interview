"use client"
import { db } from '@/utils/db';
import { MockInterview } from '@/utils/schema';
import { eq } from 'drizzle-orm';
import React , {useEffect,useState} from 'react'
import QuestionsSection from './_components/QuestionsSection';
import RecordAnswerSection from './_components/RecordAnswerSection';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

function StarInterview({params}) {
    
 
  const [interviewData, setInterviewData] = useState();
  const [mockInterviewQuestion, setMockInterviewQuestion] = useState([]); 
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
  useEffect(()=>{
    GetInterviewDetails()
  },[]);
  /**
   * Fetch Interview Details by MockId/Interview Id
   */
  const GetInterviewDetails = async () => {
    const result = await db.select().from(MockInterview)
    .where(eq(MockInterview.mockId, params.interviewId));
    const jsonMockResp=JSON.parse(result[0].jsonMockResp) ;
    console.log(jsonMockResp);
    setMockInterviewQuestion(jsonMockResp);
    setInterviewData(result[0]); 
      
  };
  


  return (
    <div >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10  ">
        {/* Question */}
        
         <QuestionsSection
          mockInterviewQuestion = {mockInterviewQuestion}
          activeQuestionIndex= {activeQuestionIndex}
          />
          <RecordAnswerSection 
          mockInterviewQuestion = {mockInterviewQuestion}
          activeQuestionIndex= {activeQuestionIndex}
          interviewData={interviewData}
          />
       
      </div>
      <div className='flex justify-end gap-6  -mt-32'>
        <div  className='flex justify-between gap-60 ml-2' >
        { activeQuestionIndex>0&&
         <Button  className="bg-purple-900 ml-7 " onClick={()=>setActiveQuestionIndex(activeQuestionIndex-1) }  >Previous Question</Button>}
        { activeQuestionIndex!=mockInterviewQuestion?.length-1&&
         <Button className="bg-purple-900 mr-4" onClick={()=>setActiveQuestionIndex(activeQuestionIndex+1) } >Next Question</Button>}

        { activeQuestionIndex==mockInterviewQuestion?.length-1&&

        <Link href={'/dashboard/interview/'+interviewData?.mockId+"/feedback"} >
            <Button className="bg-purple-900 mr-4" >End Interview</Button>
        </Link>
        }
        </div>
      </div>

    </div>
  )
}

export default StarInterview



