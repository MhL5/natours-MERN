const APIfeatures = require("../utils/apiFeatures");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

// * we are gonna replace our crud handlers with this factories here
/*
exports.deleteTour = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const tour = await Tour.findByIdAndDelete(id);

  // Handling errors
  if (!tour) return next(new AppError("No tour found with that ID", 404));

  res.status(204).json({ status: "success", data: null });
});
*/
exports.deleteOne = function (Model) {
  return catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const doc = await Model.findByIdAndDelete(id);

    // Handling errors
    if (!doc) return next(new AppError("No document found with that ID", 404));

    res.status(204).json({ status: "success", data: null });
  });
};

/*
exports.updateTour = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const options = { new: true, runValidators: true };
  const newTourData = req.body;
  const tour = await Tour.findByIdAndUpdate(id, newTourData, options);

  // Handling errors
  if (!tour) return next(new AppError("No tour found with that ID", 404));

  res.status(201).json({ status: "success", data: { tour } });
});
*/
exports.updateOne = function (Model) {
  return catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const newDocData = req.body;
    const options = { new: true, runValidators: true };

    const doc = await Model.findByIdAndUpdate(id, newDocData, options);
    // Handling errors
    if (!doc) return next(new AppError("No document found with that ID", 404));

    res.status(201).json({ status: "success", data: { data: doc } });
  });
};

/*
exports.createTour = catchAsync(async (req, res, next) => {
  const data = req.body;
  const newTour = await Tour.create(data);

  res.status(201).json({
    status: "success",
    data: { newTour },
  });
});
*/
exports.createOne = function (Model) {
  return catchAsync(async (req, res, next) => {
    const dataObj = req.body;
    const newDoc = await Model.create(dataObj);

    res.status(201).json({ status: "success", data: { data: newDoc } });
  });
};

exports.getOne = function (Model, populateOptions) {
  return catchAsync(async (req, res, next) => {
    const { id } = req.params;

    // building the query
    let query;
    const isId = /^[0-9a-f]{24}$/.test(id);
    // req.params.id might be an slug ("The-Sea-Explorer") or id ("5c88fa8cf4afda39709c2951")
    if (isId) query = Model.findById(id);
    else query = Model.findOne({ slug: id });

    if (populateOptions) query = query.populate(populateOptions);

    // !ME
    if (id.length > 24)
      return next(new AppError("No document found with that ID", 404));
    // !ME
    // executing the query
    const doc = await query;
    // Handling errors
    if (!doc) return next(new AppError("No document found with that ID", 404));

    res.status(200).json({
      status: "success",
      data: { data: doc },
    });
  });
};

exports.getAll = function (Model) {
  return catchAsync(async (req, res, next) => {
    //TODO: Fixing this workaround
    // To allow for nested route reviews on tour
    let filter = {};
    if (req.params.tourId) filter = { tour: req.params.tourId };

    //* 1. building the query
    const features = new APIfeatures(Model.find(filter), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    //* 2. executing the query
    // const doc = await features.query.explain();
    const doc = await features.query;

    if (!doc)
      return next(new AppError("Something went wrong! please try again", 500));
    //* 3. send response
    res
      .status(200)
      .json({ status: "success", results: doc.length, data: { data: doc } });
  });
};
