interface ResultSubject {
  subject: string;
  max: number;
  obtain: number;
  grade: string;
}

interface ResultData {
  studentName: string;
  fatherName: string;
  motherName: string;
  rollNo: string;
  class: string;
  session: string;
  subjects: ResultSubject[];
}

export default function ResultCard({ data }: { data: ResultData }) {
  return (
  <div
  className="
    bg-white
    rounded-3xl
    border-2
    border-orange-300
    shadow-[0_18px_45px_rgba(249,115,22,0.18)]
    overflow-hidden
  "
>
  {/* Top Header */}
  <div className="bg-gradient-to-r from-orange-50 via-white to-blue-50 px-5 py-6 sm:px-8 lg:px-10">
    <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
      <div>
        <p className="mb-2 text-sm font-semibold uppercase tracking-[0.18em] text-orange-500">
          Student Result
        </p>

        <h2 className="text-2xl font-bold text-[#072F60] sm:text-3xl lg:text-4xl">
          {data.studentName}
        </h2>

        <div className="mt-5 grid grid-cols-1 gap-x-10 gap-y-3 text-sm text-slate-700 sm:grid-cols-2 sm:text-base">
          <p>
            <span className="font-semibold text-[#072F60]">Father:</span>{" "}
            {data.fatherName}
          </p>

          <p>
            <span className="font-semibold text-[#072F60]">Mother:</span>{" "}
            {data.motherName}
          </p>

          <p>
            <span className="font-semibold text-[#072F60]">Roll No:</span>{" "}
            {data.rollNo}
          </p>

          <p>
            <span className="font-semibold text-[#072F60]">Class:</span>{" "}
            {data.class}
          </p>

          <p>
            <span className="font-semibold text-[#072F60]">Session:</span>{" "}
            {data.session}
          </p>
        </div>
      </div>

      {/* Result Badge */}
      <div
        className="
          inline-flex
          w-fit
          items-center
          justify-center
          rounded-2xl
          border
          border-green-200
          bg-green-50
          px-6
          py-3
          shadow-sm
        "
      >
        <span className="mr-2 h-2.5 w-2.5 rounded-full bg-green-500" />
        <span className="text-lg font-bold tracking-wide text-green-700 sm:text-xl">
          PASS
        </span>
      </div>
    </div>
  </div>

  {/* Table Section */}
  <div className="p-4 sm:p-6 lg:p-10">
    <div className="overflow-x-auto rounded-2xl border border-slate-200 shadow-sm">
      <table className="min-w-[650px] w-full border-collapse">
        <thead>
          <tr className="bg-[#C53213] text-white">
            <th className="px-4 py-4 text-left text-sm font-semibold sm:px-6">
              Subject
            </th>

            <th className="px-4 py-4 text-center text-sm font-semibold sm:px-6">
              Max Marks
            </th>

            <th className="px-4 py-4 text-center text-sm font-semibold sm:px-6">
              Obtained
            </th>

            <th className="px-4 py-4 text-center text-sm font-semibold sm:px-6">
              Grade
            </th>
          </tr>
        </thead>

        <tbody>
          {data.subjects.map((item, index) => (
            <tr
              key={`${item.subject}-${index}`}
              className="
                border-b
                border-slate-100
                transition-colors
                duration-200
                last:border-b-0
                hover:bg-orange-50/60
              "
            >
              <td className="px-4 py-4 text-left font-semibold text-slate-800 sm:px-6">
                {item.subject}
              </td>

              <td className="px-4 py-4 text-center text-slate-600 sm:px-6">
                {item.max}
              </td>

              <td className="px-4 py-4 text-center font-semibold text-[#072F60] sm:px-6">
                {item.obtain}
              </td>

              <td className="px-4 py-4 text-center sm:px-6">
                <span
                  className="
                    inline-flex
                    min-w-12
                    justify-center
                    rounded-full
                    bg-orange-100
                    px-3
                    py-1
                    text-sm
                    font-bold
                    text-orange-700
                  "
                >
                  {item.grade}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
</div>
  );
}