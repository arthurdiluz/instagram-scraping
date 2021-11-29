const puppeteer = require('puppeteer');
const axios = require('axios').default;
const path = require('path');
const fs = require('fs');

(async (username = 'arthurdiluz') => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  const profile_url = `https://www.instagram.com/${username}/`;

  try {
    await page.goto(profile_url);
    
    imagesURL = await page.evaluate(() => {
      // get a node list of all images
      const imgsNodeList = document.querySelectorAll('article img');

      // checks whether there are pictures in the profile
      if (!imgsNodeList.length) throw Error('no picture found');
      
      // transform NodeList in an array (array of elements)
      const imgsArray = [...imgsNodeList];
      
      // returns the image URL of each element
      return imgsArray.map(image => { return image['src'] });
    });
    
    imagesURL.forEach(url => {
      // creates the directory and download the profile images
      axios.get(url, { responseType: 'stream' }).then(response => {
          const directory = path.join('download', 'profiles', username, 'feed')
          const filename = `${username}-${Date.now()}`
          
          fs.mkdirSync(directory, { recursive: true })
          response.data.pipe(fs.createWriteStream(`${directory}/${filename}.png`))
        });
    });
  } catch (error) {
    console.error(error);
    return error;
  } finally {
    await browser.close();
  }
})();
