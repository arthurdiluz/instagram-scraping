const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

(async (username = 'arthurdiluz') => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  const profile_url = `https://www.instagram.com/${username}/`;
  
  await page.goto(profile_url);

  imagesList = await page.evaluate(() => {
    // get a node list of all images
    const imgsNodeList = document.querySelectorAll('article img');

    // transform NodeList in an array (array of elements)
    const imgsArray = [... imgsNodeList];

    // returns the image URL of each element
    return imgsArray.map(image => { return image['src']});
  });
  
  // creates a JSON with all images URL
  try {
    // creates path to JSON
    fs.mkdirSync(path.join('api', 'profiles', username), { recursive: true }, error => {
      if (error) throw Error(error);
      console.warn('path created');
    })

    // creates JSON with images URL
    fs.writeFile(
      path.resolve('api', 'profiles', username, 'images.json'),
      JSON.stringify(imagesList, null, 2),
      'utf-8',
      error => {
        if (error) throw Error(error);
        console.log(`${imagesList.length} downloaded`);
      })
  } catch (error) {
    console.error(error);
    return error;
  }
  
  await browser.close(); // closes browser
})();
