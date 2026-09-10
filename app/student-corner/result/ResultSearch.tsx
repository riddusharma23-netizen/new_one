"use client";

import { useState } from "react";

export default function ResultSearch({onResult}:any){

const [form,setForm]=useState({

studentName:"",
rollNo:"",
class:"",
session:""

})

const
 handleSubmit=(e:any)=>{

e.preventDefault();

const demoData={

studentName:"Rahul Sharma",
fatherName:"Rakesh Sharma",
motherName:"Sunita Sharma",
class:"8",
section:"A",
rollNo:"1025",
session:"2025-26",

subjects:[

{
subject:"English",
max:100,
obtain:90,
grade:"A+"
},

{
subject:"Hindi",
max:100,
obtain:82,
grade:"A"
},

{
subject:"Math",
max:100,
obtain:98,
grade:"A+"
}

]

}

onResult(demoData)

}

return(

<form
onSubmit={handleSubmit}
className="bg-white rounded-3xl shadow-xl p-10">

<h1 className="text-4xl font-bold text-[#072F60]">

Check Examination Result

</h1>

<p className="text-gray-500 mt-2">

Enter details to view result

</p>

<div className="grid lg:grid-cols-4 gap-6 mt-10">

<input
placeholder="Student Name"
className="border rounded-xl h-14 px-4"
/>

<input
placeholder="Roll Number"
className="border rounded-xl h-14 px-4"
/>

<select className="border rounded-xl h-14 px-4">

<option>Select Class</option>

<option>6</option>

<option>7</option>

<option>8</option>

<option>9</option>

<option>11</option>

</select>

<select className="border rounded-xl h-14 px-4">

<option>2025-26</option>

<option>2024-25</option>

<option>2023-24</option>

</select>

</div>

<button

className="mt-8 h-12 px-10 rounded-full bg-[#F8F000] hover:bg-[#B91617] text-[#B91617] hover:text-[#F8F000] font-semibold">

View Result

</button>

</form>

)

}