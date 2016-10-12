module.exports = {
    development: {
        fb: {
            appID: '473384942709862',
            appSecret: '64e400db44636460fc49947ead8dea89',
            url: 'http://apartmate.ca/'
        },
        dbUrl: 'mongodb://nikhil:lovelife@45.55.59.29:27017/apartmate',
        cloudinary: { 
          cloud_name: 'apartmate', 
          api_key: '234246189352792', 
          api_secret: 'qsmacJuNzV9AnXFVgCjbUsSvV68' 
        }
    },
    production: {
        fb: {
            appID: '473384942709862',
            appSecret: '64e400db44636460fc49947ead8dea89',
            url: 'http://apartmate.ca/'
        },
        dbUrl: 'mongodb://nikhil:lovelife@45.55.39.221:27017/apartmate',
        cloudinary: { 
          cloud_name: 'apartmate', 
          api_key: '234246189352792', 
          api_secret: 'qsmacJuNzV9AnXFVgCjbUsSvV68' 
        }
    }
};

