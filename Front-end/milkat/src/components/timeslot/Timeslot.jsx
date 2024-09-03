// src/TimeSlotPicker.js
import React from "react";
import { Grid, TextField, Button } from "@mui/material";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import { IoMdClose } from "react-icons/io";
import styles from "./timeslot.module.scss";

const TimeSlotPicker = ({ timeSlots, setTimeSlots }) => {
  const addTimeSlot = () => {
    setTimeSlots([...timeSlots, { start: new Date(), end: new Date() }]);
  };

  const handleTimeChange = (index, type, newValue) => {
    const updatedTimeSlots = timeSlots.map((slot, i) =>
      i === index ? { ...slot, [type]: newValue } : slot
    );
    setTimeSlots(updatedTimeSlots);
  };

  return (
    <LocalizationProvider
      dateAdapter={AdapterDateFns}
      className={styles.container}
    >
      {timeSlots.length === 0 ? (
        <p className={styles.noTime}>No time slots added yet</p>
      ) : null}
      {timeSlots.map((slot, index) => (
        <Grid
          container
          rowSpacing={1}
          columnSpacing={{ xs: 1, md: 2 }}
          key={index}
          className={styles.gridContainer}
        >
          <Grid item xs={5} md={5.5}>
            <DateTimePicker
              label="Start Time"
              value={slot.start}
              views={["year", "month", "day", "hours", "minutes"]}
              onChange={(newValue) =>
                handleTimeChange(index, "start", newValue)
              }
              renderInput={(params) => <TextField {...params} fullWidth />}
            />
          </Grid>
          <Grid item xs={5} md={5.5}>
            <DateTimePicker
              label="End Time"
              value={slot.end}
              views={["year", "month", "day", "hours", "minutes"]}
              onChange={(newValue) => handleTimeChange(index, "end", newValue)}
              renderInput={(params) => <TextField {...params} fullWidth />}
            />
          </Grid>
          <Grid item xs={2} md={1}>
            <IoMdClose
              className={styles.removeIcon}
              size={40}
              onClick={() =>
                setTimeSlots(timeSlots.filter((_, i) => i !== index))
              }
            />
          </Grid>
        </Grid>
      ))}
      <Button onClick={addTimeSlot} variant="contained" color="secondary">
        Add Time Slot
      </Button>
    </LocalizationProvider>
  );
};

export default TimeSlotPicker;
