class APIFeatures {
  constructor(query, queryObj) {
    this.query = query;
    this.queryObj = queryObj;
  }

  filter() {
    const queryObj = { ...this.queryObj };
    const excludedFields = ['page', 'limit', 'sort', 'fields'];
    excludedFields.forEach(field => delete queryObj[field]);

    // 1) Advanced filtering
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);

    // Method 1 of writing Database query
    //  let query = Tour.find(JSON.parse(queryStr));

    // Method 2 of writing Database query
    // const query =  Tour.find()
    //   .where('duration')
    //   .equals(5)
    //   .where('difficult')
    //   .equals('easy');
    this.query = this.query.find(JSON.parse(queryStr));

    return this;
  }

  sort() {
    if (this.queryObj.sort) {
      const sortBy = this.queryObj.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy); // sort('price ratingsAverage')
    } else {
      this.query = this.query.sort('-createdAt');
    }
    return this;
  }

  limitFields() {
    if (this.queryObj.fields) {
      const fields = this.queryObj.fields.split(',').join(' ');
      // Projection (operation of selecting specific field names)
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select('-__v'); // - here means exclude the field __v
    }

    return this;
  }

  paginate() {
    const page = this.queryObj.page * 1 || 1;
    const limit = this.queryObj.limit * 1 || 100;
    const skip = page * limit - limit;

    this.query = this.query.skip(skip).limit(limit);

    return this;
  }
}

module.exports = APIFeatures;
