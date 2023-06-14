const express = require('express');
const fs = require('fs');

const app = express();
app.use(express.json());
// Custom Middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

const getAllTours = (req, res) => {
  res.status(200).json({
    status: 'success',
    requestedAt: req.requestTime,
    results: tours.length,
    data: {
      tours
    }
  });
};

const getTour = (req, res) => {
  console.log(req.params);

  const id = req.params.id * 1;

  if (id > tours.length) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID'
    });
  }

  const tour = tours.find(el => el.id === id);
  res.status(200).json({
    status: 'success',
    data: {
      tour
    }
  });
};

const createTour = (req, res) => {
  const newId = tours[tours.length - 1].id + 1;
  const newTour = { id: newId, ...req.body };
  tours.push(newTour);
  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    err => {
      res.status(201).json({
        status: 'success',
        data: {
          newTour
        }
      });
    }
  );
};

// app.get('/api/v1/tours/:id', getTour);
// app.get('/api/v1/tours', getAllTours);
// app.post('/api/v1/tours', createTour);

app
  .route('/api/v1/tours')
  .get(getAllTours)
  .post(createTour);

app.route('/api/v1/tours/:id').get(getTour);

const port = 3000;

app.listen(port, () => {
  console.log(`App running on port ${port}`);
});
