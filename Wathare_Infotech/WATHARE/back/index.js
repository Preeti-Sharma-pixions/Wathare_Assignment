import express from "express";
import mongoose from "mongoose";
import { PORT, mongoDBURL } from "./config.js";
import { Data } from "./WathareData/Watharemodel.js";
import moment from 'moment'; // Importing moment.js for date validation
import cors from "cors"

const app = express();
app.use(express.json());
app.use(cors())

app.get('/all', async (request, response) => {
  try {
    const data = await Data.find({});
    console.log(data)
    const timestamps = data.map(item => item.ts);
    const machineStatuses = data.map(item => item.machine_status);

    const zerosCount = machineStatuses.filter(status => status === 0).length;
    const onesCount = machineStatuses.filter(status => status === 1).length;
    const nullCount = machineStatuses.filter(status => status === '').length;
    let variationsCount = 0;
    for (let i = 0; i < machineStatuses.length - 1; i++) {
      if (machineStatuses[i] !== machineStatuses[i + 1]) {
        variationsCount++;
      }
    }

    const combinedData = data.map(({ ts, machine_status }) => ({ ts, machine_status }));

    return response.status(200).json({ timestamps, machineStatuses, combinedData, zerosCount, onesCount, nullCount, variationsCount });
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});

app.get('/filtered-data/startTime/:startTime/frequency/:frequency', async (request, response) => {
  try {
    const { startTime, frequency } = request.params;

    if (!moment(startTime, moment.ISO_8601, true).isValid()) {
      return response.status(400).json({ message: 'Invalid start time format. Please use ISO 8601 format.' });
    }

    const startDate = new Date(startTime);
    let endTime = new Date(startDate);

    switch (frequency) {
      case 'hour':
        endTime.setHours(endTime.getHours() + 1);
        break;
      case 'day':
        endTime.setDate(endTime.getDate() + 1);
        break;
      case 'week':
        endTime.setDate(endTime.getDate() + 7);
        break;
      case 'month':
        endTime.setMonth(endTime.getMonth() + 1);
        break;
      default:
        return response.status(400).json({ message: 'Invalid frequency. Allowed values: hour, day, week, month.' });
    }

    const filteredData = await Data.find({
      ts: { $gte: startDate.toISOString(), $lt: endTime.toISOString() }
    });

    const responseData = {
      startTime: startDate.toISOString(),
      endTime: endTime.toISOString(),
      frequency,
      data: filteredData
    };

    return response.status(200).json(responseData);
  } catch (error) {
    console.error(error.message);
    return response.status(500).json({ message: 'Internal server error.' });
  }
});

app.get('/', (req, res) => {

});

mongoose.connect(mongoDBURL)
  .then(() => {
    console.log(`App connected to database`);
    app.listen(PORT, () => {
      console.log(`App listening on port ${PORT}`);
    });

  })
  .catch((error) => { // Fixed error variable declaration here
    console.log(error);
  });
