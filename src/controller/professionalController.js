const Professional = require('../Model/professional');

const professionalController = {
  getProfessionalSpeciality: async (req, res, next) => {
    try {
      const professionalcategoryName = [
        'Certified clinical nurse specialist (CNS)',
        'Registered dietitian or nutrition professional',
        'Sports medicine',
        'Radiation oncology',
        'Hospice/palliative care',
        'Oral surgery',
        'Pain management',
        'Interventional radiology',
        'Infectious disease',
        'Surgical oncology',
        'Interventional pain management',
        'Thoracic surgery',
        'Hematology',
        'Hand surgery',
        'Gynecological oncology',
        'Colorectal surgery (proctology)',
        'Certified nurse midwife (CNM)',
        'Medical oncology',
        'Anesthesiology assistant',
        'Geriatric medicine',
        'Addiction medicine',
        'Nuclear medicine',
        'Cardiac surgery',
        'Maxillofacial surgery',
        'Advanced heart failure and transplant cardiology',
        'Preventive medicine',
        'Micrographic dermatologic surgery (MDS)',
        'Undersea and hyperbaric medicine',
        'Other',
        'Geriatric psychiatry',
      ];
      res.status(200).json(professionalcategoryName);
    } catch (err) {
      next(err);
    }
  },

  getProfessionllocation: async (req, res, next) => {
    try {
      const selectedCategories = req.body.name; // An array of selected categories
      const selectedCity = req.body.city; // Selected city
      const selectedState = req.body.state; // Selected state
      const selectedZipCode = req.body.zipCode;

      const query = {
        specialities: { $in: selectedCategories },
      };

      if (selectedCity) {
        query['locations.city'] = selectedCity;
      }
      if (selectedState) {
        query['state'] = selectedState;
      }
      if (selectedZipCode) {
        query['locations.zip_code'] = selectedZipCode;
      }

      const professionals = await Professional.find(query);

      const locations = professionals.map((professional) => {
        return professional.locations.map((location) => {
          return {
            state: professional.state,
            city: location.city,
            zipCode: location.zip_code,
            _id: professional._id,
          };
        });
      });

      const flatLocations = locations.flat();

      res.json(flatLocations);
    } catch (err) {
      next(err);
    }
  },

  getProfessionalsData: async (req, res, next) => {
    try {
      const selectedCategories = req.body.name; // An array of selected categories
      const selectedCity = req.body.city;
      const selectedState = req.body.state;
      const selectedZipCode = req.body.zipCode;
      const page = req.body.page;
      const limit = req.body.limit;

      const query = {
        specialities: { $in: selectedCategories },
      };

      if (selectedCity) {
        query['locations.city'] = selectedCity;
      }

      if (selectedState) {
        query['state'] = selectedState;
      }

      if (selectedZipCode) {
        query['locations.zip_code'] = selectedZipCode;
      }

      const professionals = await Professional.find(query).skip(page * limit).limit(limit);

      res.status(200).json(professionals);
    } catch (err) {
      next(err);
    }
  },

  getProfessionalsUsingState: async (req, res, next) => {
    try {
      const uniqureRecords = {
        state: [],
        cities: [],
        zipCode: []
      };

      const selectedCategories = req.body.name;
      const selectedCity = req.body.city;
      const selectedState = req.body.state;
      const selectedZipCode = req.body.zipCode;

      const aggregationPipeline = [
        {
          $match: {
            specialities: { $in: selectedCategories },
          },
        },
        {
          $unwind: "$locations",
        },
        {
          $match: {
            "locations.city": selectedCity || { $exists: true },
            state: selectedState || { $exists: true },
            "locations.zip_code": selectedZipCode || { $exists: true },
          },
        },
        {
          $group: {
            _id: "$_id",
            state: { $first: "$state" },
            locations: { $push: "$locations" },
          },
        },
      ];

      const professionals = await Professional.aggregate(aggregationPipeline);

      for (let i = 0; i < professionals.length; i++) {
        if (!uniqureRecords.state.includes(professionals[i].state)) {
          uniqureRecords.state.push(professionals[i].state);
        }
        for (let j = 0; j < professionals[i].locations.length; j++) {
          if (!uniqureRecords.cities.includes(capitalizeFirstLetter(professionals[i].locations[j].city))) {
            const capitalizedCity = capitalizeFirstLetter(professionals[i].locations[j].city);
            uniqureRecords.cities.push(capitalizedCity);
          }
          if (!uniqureRecords.zipCode.includes(professionals[i].locations[j].zip_code)) {
            uniqureRecords.zipCode.push(professionals[i].locations[j].zip_code);
          }
        }
      }




      res.status(200).json(uniqureRecords);
    } catch (err) {
      next(err);
    }
  },

  getProfessionalsDataForCity: async (req, res, next) => {
    try {
      const selectedCity = req.body.city;

      if (selectedCity) {
        const query = {
          'locations.city': selectedCity,
        };

        const professionalcities = await Professional.find(query);

        res.json(professionalcities);
      } else {
        const query = {
          'locations.city': 'Andalusia',
        };

        const professionalcities = await Professional.find(query);

        res.json(professionalcities);
      }
    } catch (err) {
      next(err);
    }
  },

};

module.exports = professionalController;

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

const capitalizeFirstLetter = (str) => {
  return str.toLowerCase().replace(/(^|\s)\S/g, (match) => match.toUpperCase());
};
