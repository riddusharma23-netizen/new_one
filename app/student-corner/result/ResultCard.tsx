export default function ResultCard({data}:any){

return(

<div className="bg-white rounded-3xl shadow-xl p-10">

<div className="flex justify-between flex-wrap">

<div>

<h2 className="text-3xl font-bold text-[#072F60]">

{data.studentName}

</h2>

<p>Father : {data.fatherName}</p>

<p>Mother : {data.motherName}</p>

<p>Roll No : {data.rollNo}</p>

<p>Class : {data.class}</p>

<p>Session : {data.session}</p>

</div>

<div className="bg-green-100 rounded-xl px-8 py-4 h-fit">

<h3 className="text-green-700 text-2xl font-bold">

PASS

</h3>

</div>

</div>

<table className="w-full mt-10">

<thead>

<tr className="bg-[#072F60] text-white">

<th className="py-3">Subject</th>

<th>Max</th>

<th>Obtained</th>

<th>Grade</th>

</tr>

</thead>

<tbody>

{data.subjects.map((item:any,index:number)=>(

<tr key={index} className="text-center border-b">

<td className="py-4">

{item.subject}

</td>

<td>

{item.max}

</td>

<td>

{item.obtain}

</td>

<td>

{item.grade}

</td>

</tr>

))}

</tbody>

</table>

</div>

)

}