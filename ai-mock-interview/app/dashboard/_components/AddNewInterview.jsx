"use client";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { v4 as uuidv4 } from "uuid";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { chatSession } from "@/utils/GeminiAIModal";
import { LoaderCircle } from "lucide-react";
import { db } from "@/utils/db";
import { MockInterview } from "@/utils/schema";
import { useUser } from "@clerk/nextjs";
import moment from "moment";
import { useRouter } from "next/navigation";

function AddNewInterview() {
  const [openDialog, setOpenDialog] = useState(false);
  const [jobPosition, setJobPosition] = useState();
  const [companyName, setCompanyName] = useState();
  const [jobDesc, setJobDesc] = useState();
  const [jobExperience, setJobExperience] = useState();
  const [loading, setLoading] = useState(false);
  const [jsonResponse, setJsonResponse] = useState([]);
  const router = useRouter();
  const { user } = useUser();

  const onSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
    console.log(jobPosition, companyName, jobDesc, jobExperience);
    const InputPrompt =
      " Generate " +process.env.NEXT_PUBLIC_INTERVIEW_QUESTION_COUNT +" interview questions based on the following information. If a company name is provided, include previous interview questions typically asked by that company for the specified role. If no company name is provided, generate frequently asked interview questions relevant to the job role across multiple companies Information: Job Position: " +companyName + ", Company Name (optional): " + companyName + "  , Job Description:" +jobDesc +" ,Years of Experience: " +jobExperience +" give me question with Answered . qive me Question and Answered as field in json : If the company name is provided, make sure the questions align with that company's typical interview pattern";
    const result = await chatSession.sendMessage(InputPrompt);
    const MockJsonResp = (result.response.text()).replace('```json', '').replace('```', '');
    console.log(JSON.parse(MockJsonResp));
    setJsonResponse(MockJsonResp);
//       const parsedResponse = JSON.parse(MockJsonResp);

// // Log the parsed JSON
//       console.log(parsedResponse);

// // Set the parsed JSON object to state
//        setJsonResponse(parsedResponse);


    if (MockJsonResp) {
      const resp = await db.insert(MockInterview).values({
          mockId: uuidv4(),
          jsonMockResp: MockJsonResp,
          jobPosition: jobPosition,
          jobDesc: jobDesc,
          jobExperience: jobExperience,
          createdBy: user?.primaryEmailAddress?.emailAddress,
          createdAt: moment().format("DD-MM-yyyy"),
        }).returning({ mockId: MockInterview.mockId });

      console.log("Inserted Id:", resp);
      if(resp){
        setOpenDialog(false);
        router.push('/dashboard/interview/'+resp[0]?.mockId)
      }
    }
    else{
        console.log("Error");
    }
    setLoading(false);
  };

  return (
    <div>
      <div
        className="p-10 border rounded-lg  bg-secondary hover:scale-105 hover:shadow-md cursor-pointer
       transition-all"
        onClick={() => setOpenDialog(true)}
      >
        <h2 className=" text-lg  text-center ">+ Add New </h2>
      </div>
      <Dialog open={openDialog}>
        <DialogContent  className="max-w-2xl">
          <DialogHeader >
            <DialogTitle  className="text-2xl">
              Tell us more about your job
            </DialogTitle>
            <DialogDescription>
              <form onSubmit={onSubmit}>
                <div>
                  <h2>
                    Add Details about your job position / role, Job description
                    and years of experience{" "}
                  </h2>
                  <div className="mt-7 my-3">
                    <label>Job Role / Job Position</label>
                    <Input
                      onChange={(event) => setJobPosition(event.target.value)}
                      required
                      className="mt-3"
                      placeholder="Ex. Full Stack Developer"
                    />
                  </div>
                  <div className=" my-3">
                    <label>Company Name (Optional)</label>
                    <Input
                      onChange={(event) => setCompanyName(event.target.value)}
                      className="mt-3"
                      placeholder="Enter the company name if applicable (e.g., Amazon)"
                    />
                  </div>
                  <div className=" my-3">
                    <label>Job Description</label>
                    <Textarea
                      className="mt-3"
                      required
                      placeholder="Ex. React, Angular, C++, Java, Devops, MySql ..."
                      onChange={(event) => setJobDesc(event.target.value)}
                    />
                  </div>
                  <div className=" my-3">
                    <label>Year of experience </label>
                    <Input
                      className="mt-3"
                      placeholder="Ex. 2"
                      type="number"
                      required
                      onChange={(event) => setJobExperience(event.target.value)}
                    />
                  </div>
                </div>

                <div className="flex gap-5 justify-end">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setOpenDialog(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={loading}>
                    {loading ? <><LoaderCircle className="animate-spin" />'Generating from AI'</>: "Start Interview"
                    }
                  </Button>
                </div>
              </form>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default AddNewInterview;
