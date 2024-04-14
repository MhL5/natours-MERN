class APIfeatures {
  // TODO: take a look at mongoose way
  //* mongoose offers this functional way which we didn't use:
  //* const query = await Tour.find().where("duration").gte(5).where("difficulty").equals("easy");
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    // A.filtering
    const queryObj = { ...this.queryString };
    const excludedQueries = ["page", "sort", "limit", "fields"];
    excludedQueries.forEach((el) => delete queryObj[el]);

    // B.advance filtering
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    this.query = this.query.find(JSON.parse(queryStr));

    return this;
  }

  sort() {
    // C. sorting based on sort query if it exist
    const sortQuery = this.queryString.sort;

    if (sortQuery) this.query = this.query.sort(sortQuery.replaceAll(",", " "));
    // TODO
    // !BUGGY CODE MIGHT FIX LATER - MAKES PAGINATION RESULT TO RETURN THE WRONG DATA
    // else this.query = this.query.sort("-createdAt");

    return this;
  }

  limitFields() {
    const fieldsQuery = this.queryString.fields;
    if (fieldsQuery)
      this.query = this.query.select(fieldsQuery.replaceAll(",", " "));
    else this.query = this.query.select("-__V");

    return this;
  }

  paginate() {
    const page = +this.queryString.page || 1;
    const limit = +this.queryString.limit || 100;
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);

    return this;
  }
}

module.exports = APIfeatures;
