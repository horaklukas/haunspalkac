import Head from "next/head";
import { useEffect, useState } from "react";

const Home = () => {
  const [fields, setFields] = useState([]);
  const [schedule, setSchedule] = useState([]);

  useEffect(() => {
    fetch("/api/matches/schedule")
      .then((res) => res.json())
      .then((schedule) => setSchedule(schedule));

    fetch("/api/fields")
      .then((res) => res.json())
      .then((fields) => setFields(fields));
  }, []);

  return (
    <div className="container">
      <Head>
        <title>Haunspalkáč</title>
        {/* <link rel="icon" href="/favicon.ico" /> */}
      </Head>

      <main>
        <h1 className="title">Haunspalkáč</h1>

        {/* {fields.length > 0 && <pre>{JSON.stringify(fields, null, 2)}</pre>} */}
        {schedule.length > 0 && <pre>{JSON.stringify(schedule, null, 2)}</pre>}
      </main>
    </div>
  );
};

export default Home;
