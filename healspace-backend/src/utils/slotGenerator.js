const generateSlotsForDay = (startTimeStr, endTimeStr, slotDuration, bufferTime) => {
  const slots = [];

  const [startHour, startMin] = startTimeStr.split(':').map(Number);
  const [endHour, endMin] = endTimeStr.split(':').map(Number);

  let currentMinutes = startHour * 60 + startMin;
  const endMinutes = endHour * 60 + endMin;

  while (currentMinutes + slotDuration <= endMinutes) {
    const slotHour = Math.floor(currentMinutes / 60);
    const slotMinute = currentMinutes % 60;

    const formattedTime = `${String(slotHour).padStart(2, '0')}:${String(slotMinute).padStart(2, '0')}`;
    slots.push(formattedTime);

    // Jump forward by session length + buffer
    currentMinutes += slotDuration + bufferTime;
  }

  return slots;
};

module.exports = { generateSlotsForDay };