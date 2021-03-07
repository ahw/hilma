function getRandomColor() {
  const colors = ['#EB212E', 'yellow', 'red', 'orange', 'purple'];
  const r = Math.floor(Math.random() * colors.length);
  // return 'white';
  return colors[r];
}

function getRandomClass() {
  const classes = ['r35', 'r75', 'r115'];
  return classes[Math.floor(Math.random() * classes.length)];
}

function addCircle() {
  const div = document.createElement('div');
  div.classList.add('circle-container');
  const circle = document.createElement('div');
  circle.classList.add('circle');
  circle.style.opacity = 0;
  circle.style.setProperty('--rotation', Math.floor(Math.random() * 180) + 'deg');
  circle.style.setProperty('--start-color', 'gold');
  circle.style.setProperty('--end-color', getRandomColor());
  // const diameter = Math.floor(Math.random() * 20 + 80);
  // circle.style.margin = `${(100 - diameter)/2}%`;
  // circle.style.width = `${diameter}%`;
  // circle.style.height = `${diameter}%`;

  div.appendChild(circle);
  document.getElementById('animation-container').appendChild(div);
  setTimeout(() => {
    circle.style.opacity = 1;
  }, 10);
}

const max = 7;
for (let i = 0; i < max; i++) {
  setTimeout(() => {
    addCircle();
  }, i * 1000 + Math.random() * 7000);
}