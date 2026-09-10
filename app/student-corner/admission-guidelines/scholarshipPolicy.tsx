"use client";

import Image from "next/image";

import SectionHeading from "./components/SectionHeading";
import ScholarshipCard from "./components/ScholarshipCard";
import DownloadButton from "./components/DownloadButton";

import { scholarshipData } from "./components/data/scholarshipData";
export default function ScholarshipPolicy() {

const {
heading,
image,
eligibility,
requiredDocuments,
applicationProcess
}=scholarshipData

return(

<section className="relative py-24 overflow-hidden bg-white">

<div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[700px] rounded-full bg-gradient-to-r from-[#B60F17] via-[#FF6A00] to-[#F8F000] opacity-10 blur-[180px]" />

<div className="relative max-w-7xl mx-auto px-6">

<SectionHeading

badge={heading.badge}

titleBlack={heading.titleBlack}

titleGradient={heading.titleGradient}

description={heading.description}

/>

<div className="grid lg:grid-cols-2 gap-16 items-start">

{/* LEFT */}

<div className="relative">

<Image

src={image}

alt="Scholarship"

width={700}

height={850}

className="rounded-[35px] object-cover w-full h-[720px] shadow-2xl"

/>

<div className="absolute bottom-8 left-8 bg-white rounded-3xl p-6 shadow-xl">

<h3 className="text-4xl font-black text-[#B60F17]">

₹50,000

</h3>

<p className="text-gray-600 mt-2">

Maximum Scholarship

</p>

</div>

</div>

{/* RIGHT */}

<div className="space-y-8">

<ScholarshipCard

title="Eligibility Criteria"

points={eligibility}

/>

<ScholarshipCard

title="Required Documents"

points={requiredDocuments}

/>

<div className="rounded-[30px] bg-orange-50 border-l-[6px] border-[#FF6A00] p-8">

<h3 className="text-2xl font-bold text-[#B60F17]">

Application Process

</h3>

<p className="mt-5 text-gray-700 leading-8">

{applicationProcess}

</p>

<div className="mt-8">

<DownloadButton

text="Download Scholarship Form"

href="/pdf/scholarship-form.pdf"

/>

</div>

</div>

</div>

</div>

</div>

</section>

)
}