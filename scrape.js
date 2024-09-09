import puppeteer from "puppeteer";
import fs from "fs"; // Import fs module
import path from "path"; // Import path module

const scrape = async () => {

    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    const url = "https://www.aponet.de/apotheke/notdienstsuche?tx_aponetpharmacy_search[action]=result&tx_aponetpharmacy_search[controller]=Search&tx_aponetpharmacy_search[search][plzort]=99867%2BGotha&tx_aponetpharmacy_search[search][date]=&tx_aponetpharmacy_search[search][street]=&tx_aponetpharmacy_search[search][radius]=25&tx_aponetpharmacy_search[search][lat]=&tx_aponetpharmacy_search[search][lng]=&tx_aponetpharmacy_search[token]=216823d96ea25c051509d935955c130fbc72680fc1d3040fe3f8ca0e25f9cd08&type=1981";

    await page.goto(url);

    // Fail-safe step to get page content
    await page.content();

    const innerText = await page.evaluate(() => {
        return JSON.parse(document.querySelector("body").innerText);
    });

    console.log("innerText now contains the JSON");
    console.log(innerText.results.apotheken);

    const filePath = path.resolve("apotheken.json"); // Define the file path

    let dataToWrite = innerText.results.apotheken;

    // Check if the file already exists
    if (fs.existsSync(filePath)) {
        // If it exists, read the current content
        const existingData = JSON.parse(fs.readFileSync(filePath, "utf-8"));

        // Update or merge the existing data (e.g., concatenate arrays)
        dataToWrite = [...existingData, ...dataToWrite]; // Adjust this logic based on how you want to update

        console.log("File exists. Merging with existing data.");
    } else {
        console.log("File does not exist. Creating a new one.");
    }

    // Write the updated result to the JSON file
    fs.writeFileSync(filePath, JSON.stringify(dataToWrite, null, 2), "utf-8");
    console.log("Data has been updated and saved to apotheken.json");

    await browser.close();
};

scrape();