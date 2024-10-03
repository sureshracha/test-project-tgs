
import { UiElement, playwright, invokeBrowser, gotoUrl, closeplaywright, UiTable } from "../test-automation-wrappers/lib/playwright";
import { createLogger } from "winston";
import logger, { options } from "../test-automation-wrappers/lib/logger";
import testContext from '../test-automation-wrappers/lib/testContext';
import customAssert from '../test-automation-wrappers/lib/assert';
import * as fileUtils from '../test-automation-wrappers/utils/file.utils';

// Tips :to run only one test  append '.only' after describe
describe('A first sample Playwright test', () => {
    before(async function () {
        playwright.browser = await invokeBrowser('chrome', { headless: false });
    })

    beforeEach(async function () {
        playwright.context = await playwright.browser.newContext();
        playwright.page = await playwright.context.newPage();
        playwright.context.setDefaultTimeout(5000);
        testContext.assertsJson = JSON.parse("{}");
        testContext.assertsJson.soft = [];
        await fileUtils.ensureDir('test-results/log');
        testContext.logger = createLogger(options({ fileName: 'test', logfileFolder: 'test-results/log' }));
        await logger.info('Starting of scenario')

    });


    afterEach(async function () {
        closeplaywright();
    });

    after(async function () {
        playwright.browser.close();
    });


    it('Search Playwright documentation from Goggle', async () => {
        let year = '2024'
        let partyName = new UiElement('#link4', { description: 'party Name' });
        await gotoUrl('https://csis.tshc.gov.in/');
        await playwright.page.waitForTimeout(5000);
        await partyName.click();
        await new UiElement('#both',{description: 'Radio both'}).click();
        await new UiElement('#pet',{description: 'party name both'}).setValue('TSPSC');
        await new UiElement('#pyear',{description: 'party year both'}).setValue(year);
       
        console.log('yes');
        
        await new UiElement('#searchfour',{description: 'Search button'}).click();
        // await new UiElement('#pcaptcha',{description: 'party captcha '}).setValue('2024');
        await playwright.page.waitForTimeout(10000);
        console.log('yes');
        let tabl = new UiTable('#inftable');
       let rows =  await tabl.getRowsLength();
       let json = JSON.parse('[]');
        for(let row = 2; row<rows; row++){
            let sts = await new UiTable('#inftable').getCellData(row,3);
            let r=row;
            if(sts === 'Pending'){
                
                let linkName = await new UiTable('#inftable').getCellData(r,0);
               await (await new UiTable('#inftable').getRow(r)).clickLink(linkName,{force:true}) 
                  await playwright.page.waitForTimeout(10000);
                 const b =  await playwright.page.frameLocator(`//iframe`);

   
                let filingDate =await  b.locator('//*[@id="inftable"]/tbody/tr[7]/td[2]').innerText();
               let listingDate =await  b.locator('//*[@id="inftable"]/tbody/tr[8]/td[2]').innerText();  
               let purpose = await b.locator('//*[@id="inftable"]/tbody/tr[9]/td[2]').innerText();  
               let cnrNumber = await b.locator('//*[@id="inftable"]/tbody/tr[3]/td[2]').innerText(); 
               let registerDate = await b.locator('//*[@id="inftable"]/tbody/tr[7]/td[4]').innerText();  

               
                let row ={ "FiledName": linkName,"Status" :sts , "FileingDate":filingDate, "ListingDate":listingDate, "purpose": purpose,"CRN":cnrNumber,"RegistrationDate": registerDate }
                // json.FiledName = linkName;
                // json.Status = sts;
                // json.FileingDate = filingDate;
                // json.ListingDate = listingDate;
                // json.Purspose = purpose;
                // json.CNRNumber = cnrNumber;
                // json.RegisterDate = registerDate;
                json.push( row);
                console.log(JSON.stringify(json));
                await playwright.page.locator('//html/body/div[2]/div[2]').click();
                await playwright.page.waitForTimeout(10000);
                console.log('yes');
            }

        } 
       

        await fileUtils.writeJsonData(`D:/padma/cases_${year}.json`,json);
        return true;
    })

});