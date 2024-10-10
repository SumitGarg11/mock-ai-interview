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
import { db } from '@/utils/db';

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
        setResults,
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
            if(!isRecording&&userAnswer.length>10){
                UpdateUserAnswer();
            }
          
        },[userAnswer]) 

        const StartStopRecording=async()=>{
            if(isRecording){
               
                stopSpeechToText();
              
               
            }else{
                startSpeechToText();
            }
        }

        const UpdateUserAnswer=async()=>{
              console.log(userAnswer);
               setLoading(true);
               const feedbackPrompt = "Question:"+mockInterviewQuestion[activeQuestionIndex]?.Question+
               ", User Answer:"+userAnswer+",Depends on question and user answer for give interview question "+
               "please give us rating for answer and feedbackas area of improvement if any "+
               "in just 3 to 5 lines to improve it in JSON format with rating field  and feedback field ";
               const result = await chatSession.sendMessage(feedbackPrompt);
               const MockJsonResp = (result.response.text()).replace('```json', '').replace('```', '');
               console.log((MockJsonResp));
               
               const JsonFeedbackResp = JSON.parse(MockJsonResp);
               const resp = await db.insert(UserAnswer).values({
                mockIdRef:interviewData?.mockId,
                question:mockInterviewQuestion[activeQuestionIndex]?.Question,
                correctAns:mockInterviewQuestion[activeQuestionIndex]?.Answer,
               
                userAns: userAnswer,
                feedback:JsonFeedbackResp?.feedback,
                rating:JsonFeedbackResp?.rating,
                userEmail:user?.primaryEmailAddress?.emailAddress,
                createdAt:moment().format('DD-MM-yyyy')
               })
               console.log(resp);
               if(resp){
                toast('User Answer recorded successfully');
                SetUserAnswer('');
                setResults([]);
               }
               setResults([]);
               setLoading(false);
        }
  return (
    <div className='flex items-center justify-center flex-col   ' >
        
        <div className='flex flex-col -mt-32  justify-center items-center  ml-3 bg-black rounded-lg  w-11/12 p-5' style={{ height: '320px', width: '95%' }}>
            <Image src={'/cam.png'} width={140} height={140} className='absolute '  /> 
            <Webcam   mirrored={true} style={{
            height:'270px',
            width:'100%',
            zIndex:10,
            borderRadius: '0.5rem',
        
            }}  />
        </div>
        
        
        <Button  disabled={loading}  className=" cursor-pointer mt-6 mr-2  bg-purple-900"
        onClick={StartStopRecording}
        >
            { isRecording ? <h2 className='text-red-600  animate-pulse flex flex-col-1 gap-2 mt-1'   > <StopCircle/> Stop Recording </h2> 
            :
            <h2 className='text-white flex gap-2 mt-1 items-center'   > <Mic/> Record Answer</h2> }
        </Button>
      
    </div>
  )
}

export default RecordAnswerSection
