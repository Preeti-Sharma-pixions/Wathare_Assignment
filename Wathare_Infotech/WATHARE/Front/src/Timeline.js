import React, { useEffect, useState } from 'react';
import "./App.css";
import Axios from 'axios'; // Import Axios for making HTTP requests

const Timeline = () => {
  const [timelineData, setTimelineData] = useState([]);
  const [zerosCount, setZerosCount] = useState(0); // Initialize count state variables with default values
  const [onesCount, setOnesCount] = useState(0);
  const [variation, setVariations] = useState(0);

  useEffect(() => {
    // Fetch data from the '/all' endpoint when the component mounts
    const fetchData = async () => {
      try {
        const response = await Axios.get('http://localhost:5555/all'); // Replace with your actual server URL
        console.log(response);
        const data = response.data;
        setTimelineData(data.combinedData); // Assuming combinedData contains the timeline data
        setZerosCount(data.zerosCount);
        setOnesCount(data.onesCount);
        setVariations(data.variationsCount);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();

    // Cleanup function to handle component unmounting
    return () => {
      // Any cleanup code here
    };
  }, []); // Empty dependency array ensures useEffect runs only once

  return (
    <div className='time'>
      <div className='timeline'>
        {timelineData.map((value, index) => (
          value.machine_status === 1 ?
            <div key={index} className='timesegment'></div> :
            value.machine_status === 0 ?
              <div key={index} className='timesegment1'></div> :
              <div key={index} className='timesegment2'></div>
        ))}
      </div>
      <table border={2}>
        <tbody> {/* Added tbody to enclose table rows */}
          <tr>
            <td>
              number of zeros
            </td>
            <td>
              number of ones
            </td>
            <td>
              variations count
            </td>
          </tr>
          <tr>
            <td>
              {zerosCount}
            </td>
            <td>
              {onesCount}
            </td>
            <td>
              {variation}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default Timeline;
