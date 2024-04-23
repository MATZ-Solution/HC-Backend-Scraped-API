const npiModel = require('../Model/npiModel');

const npiController = {
 

  getNpiData: async (req, res, next) => {
    try {



        const pipeline = [
            {
                $group: {
                    _id: "$state",
                    count: { $sum: 1 }
                }
            },
            {
                $project: {
                    _id: 0,
                    state: "$_id",
                    count: 1
                }
            }

        ];
        const result = await npiModel.aggregate(pipeline);

        res.status(200).json({result });
 
    } catch (err) {
      next(err);
    }
  },
  getNpiDataByState: async (req, res, next) => {
    try {

        const { state } = req.query; 
        const indexes=await npiModel.collection.getIndexes();
        console.log(indexes,"esf")
        // await npiModel.dropIndex("city_1");

        const pipeline = [
            { $match: { state: state } }, // Filter documents by the specified state
            {
                $group: {
                    _id: "$city",
                    count: { $sum: 1 }
                }
            },
            {
                $project: {
                    _id: 0,
                    city: "$_id",
                    count: 1
                }
            }
        ];
        // const result = await npiModel.find(query).explain("executionStats");

        const result = await npiModel.aggregate(pipeline)
        // console.log(result,"result")
        res.status(200).json({result });
 
    } catch (err) {
      next(err);
    }
  },

  getNpiDataByCity: async (req, res, next) => {
    try {
      const { city } = req.query;
  
      const pipeline = [
          { $match: { city: city } },
          { $unwind: "$taxonomies" },
          {
              $group: {
                  _id: "$taxonomies.name",
                  count: { $sum: 1 }
              }
          },
          {
              $project: {
                  _id: 0,
                  name: "$_id",
                  count: 1
              }
          }
      ];
  
      const result = await npiModel.aggregate(pipeline);
  
      // Extracting the array of objects from the result
      const taxonomyCounts = result.map(item => ({ name: item.name, count: item.count }));
  
      res.status(200).json(taxonomyCounts);
  } catch (err) {
      next(err);
  }
  
    
  },
  getNpiDataById: async (req, res, next) => {
    try {
    const { city, taxonomyName } = req.query;

    const query = {
        "city": city,
        "taxonomies.name": taxonomyName
    };

    const result = await npiModel.find(query).exec();

    res.status(200).json({ result });
} catch (err) {
    next(err);
}
    
  },


};

module.exports = npiController;

/*
getCategoryName: async (req, res, next) => {
    try {

      const categoryName = ["Hospital", "Long Term Cares", "Nursing Home", "Dialysis Facility", "Ho Spice", "Inpatient Rehabilitiation"
        , "Group Practice", "Home Health"
      ];

      res.status(200).json(categoryName)

    } catch (err) {
      next(err);
    }
  },
*/

// const capitalizeFirstLetter = (str) => {
//   return str.toLowerCase().replace(/(^|\s)\S/g, (match) => match.toUpperCase());
// };
