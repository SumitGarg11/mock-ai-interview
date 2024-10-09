"use client"
import useSpeechToText from 'react-hook-speech-to-text';
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import Webcam from 'react-webcam'
import { Mic, StopCircle } from 'lucide-react';
import { toast } from 'sonner';
import { chatSession } from '@/utils/GeminiAIModal';
import { UserAnswer } from '@/utils/schema';
import { useUser } from '@clerk/nextjs';
import moment from 'moment';

function RecordAnswerSection({mockInterviewQuestion,activeQuestionIndex, interviewData}) {
    const [userAnswer,SetUserAnswer] = useState('');
    const {user} = useUser();
    const [loading,setLoading] = useState(false);
    const {

        error,
        interimResult,
        isRecording,
        results,
        startSpeechToText,
        stopSpeechToText,
    } = useSpeechToText({
        continuous: true,
        useLegacyResults: false
        });
        useEffect(()=>{
            results.map((result)=>(
                SetUserAnswer(prevAns=>prevAns+result?.transcript)
            ))
        },[results])

        useEffect(()=>{

        },[userAnswer]) // leave the here 2:51:29

        const StartStopRecording=async()=>{
            if(isRecording){
               
                stopSpeechToText();
                if(userAnswer?.length<10){
                    setLoading(false);
                    
                    toast('Your answer is too short. Please provide a more detailed response and record again.');
                    return;
                }
               
            }else{
                startSpeechToText();
            }
        }

        const UpdateUserAnswer=async()=>{
               setLoading(true);
               const feedbackPrompt = "Question:"+mockInterviewQuestion[activeQuestionIndex]?.Question+
               ", User Answer:"+userAnswer+",Depends on question and user answer for give interview question "+
               "please give us rating for answer and feedbackas area of improvement if any "+
               "in just 3 to 5 lines to improve it in JSON format with rating field  and feedback field ";
               const result = await chatSession.sendMessage(feedbackPrompt);
               const MockJsonResp = (result.response.text()).replace('```json', '').replace('```', '');
               console.log(JSON.parse(MockJsonResp));
               const JsonFeedbackResp = JSON.parse(MockJsonResp);
               const resp = await db.insert(UserAnswer)
               .values({
                mockIdRef:interviewData?.mockId,
                question:mockInterviewQuestion[activeQuestionIndex]?.Question,
                corrAns:mockInterviewQuestion[activeQuestionIndex]?.Answer,
                userAns: userAnswer,
                feedback:JsonFeedbackResp?.feedback,
                rating:JsonFeedbackResp?.rating,
                userEmail:user?.primaryEmailAddress?.emailAddress,
                createdAt:moment().format('DD-MM-yyyy')
               })
               if(resp){
                toast('User Answer recorded successfully');
               }
               SetUserAnswer('');
               setLoading(false);
        }
  return (
    <div className='flex items-center justify-center flex-col' >
        <div className='flex flex-col my-20 justify-center items-center mt-11 ml-5 bg-black rounded-lg  w-11/12 p-5' style={{ height: '320px', width: '95%' }}>
            <Image src={'/cam.png'} width={140} height={140} className='absolute '  /> 
            <Webcam   mirrored={true} style={{
            height:'270px',
            width:'100%',
            zIndex:10,
            borderRadius: '0.5rem',
        
            }}  />
        </div>
        
        <Button  disabled={loading}  className="my-10  cursor-pointer "
        onClick={StartStopRecording}
        >
            { isRecording ? <h2 className='text-red-600  animate-pulse flex flex-col-1 gap-2 mt-1'   > <StopCircle/> Stop Recording </h2> 
            :
            <h2 className='text-white flex gap-2 mt-1 items-center'   > <Mic/> Record Answer</h2> }
        </Button>
      <Button onClick={()=>console.log(userAnswer)} >Show User Ans</Button>
    </div>
  )
}

export default RecordAnswerSection
