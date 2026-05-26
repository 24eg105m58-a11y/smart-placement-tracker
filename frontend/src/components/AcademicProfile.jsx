import { useEffect, useState } from "react";
import axios from "axios";

const AcademicProfile = () => {
  const [edit, setEdit] = useState(false);

  const [student, setStudent] = useState(null);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/student-api/get-academicDetails",
        {
          withCredentials: true,
        },
      );

      setStudent(res.data.payload);
    } catch (err) {
      console.log(err);
    }
  };

  const save = async () => {
    await axios.put(
      "http://localhost:5000/student-api/update-academicDetails",
      student,
      {
        withCredentials: true,
      },
    );

    setEdit(false);
  };

  if (!student) return <>Loading...</>;

  return (
    <div>
      <div className="flex justify-between">
        <h1 className="text-3xl font-bold">Academic Profile</h1>

        <button
          onClick={() => (edit ? save() : setEdit(true))}
          className="
bg-blue-600
text-white
px-5
py-2
rounded-xl"
        >
          {edit ? "Save" : "Edit"}
        </button>
      </div>

      <div
        className="
mt-8
bg-white
rounded-3xl
shadow
p-8
grid
grid-cols-2
gap-6"
      >
        {Object.entries(student).map(([k, v]) => (
          <div key={k}>
            <p className="mb-2 text-gray-500">{k}</p>

            {edit ? (
              <input
                value={v}
                onChange={(e) =>
                  setStudent({
                    ...student,
                    [k]: e.target.value,
                  })
                }
                className="
w-full
border
rounded-xl
p-3"
              />
            ) : (
              <div
                className="
bg-gray-50
p-3
rounded-xl"
              >
                {String(v)}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AcademicProfile;
