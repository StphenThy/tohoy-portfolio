// CLOCK: your live local time, shown the same for visitors in any country.

const CLOCK = {
  city: "Davao City",
  offset: "GMT+8",
  timeZone: "Asia/Manila",
};

document.getElementById("clockPlace").textContent = CLOCK.city;
document.getElementById("clockOffset").textContent = CLOCK.offset;

const clockTime = document.getElementById("clockTime");
const clockFormat = new Intl.DateTimeFormat("en-GB", {
  timeZone: CLOCK.timeZone,
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hourCycle: "h23",
});

const tick = () => { clockTime.textContent = clockFormat.format(new Date()); };
tick();
setInterval(tick, 1000);
