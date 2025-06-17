class APIFeatures<T> {
  query: any;
  queryString: any;
  options: { searchFields?: string[] };

  constructor(query: any, queryString: any, options = {}) {
    this.query = query;
    this.queryString = queryString;
    this.options = options;
  }

  filter() {
    const queryObj: any = {};

    if (this.queryString.category) {
      queryObj.category = this.queryString.category;
    }

    if (this.queryString.active) {
      queryObj.isActive = this.queryString.active === "true";
    }

    // add more filters if needed

    this.query = this.query.find(queryObj);
    return this;
  }

  search() {
    if (this.queryString.search && this.options.searchFields?.length) {
      const searchRegex = new RegExp(this.queryString.search, "i");
      const searchConditions = this.options.searchFields.map((field) => ({
        [field]: searchRegex,
      }));

      this.query = this.query.find({ $or: searchConditions });
    }
    return this;
  }

  sort() {
    if (this.queryString.sort) {
      const sortBy = (this.queryString.sort as string).split(",").join(" ");
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort("-createdAt");
    }
    return this;
  }

  paginate() {
    const page = parseInt(this.queryString.page as string) || 1;
    const limit = parseInt(this.queryString.limit as string) || 10;
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);
    return this;
  }
}

export default APIFeatures;
