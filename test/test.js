const { Builder, By } = require('selenium-webdriver');
const firefox = require('selenium-webdriver/firefox');
const chai = require('chai');
const {expect} = chai;
const path = require("path");

let totalTests = 0;
let passedTests = 0;

function parsePixels(value){
    return parseFloat(value.replace('px', ''));
}

describe('Contact Page Test', function(){

    let driver;
    this.timeout(30000);

    const options = new firefox.Options();
    options.headless();
    options.setPreference('browser.download.manager.showWhenStarting', false);
    options.setPreference('browser.download.manager.useWindow', false);

    const filePath = path.join(__dirname, '..', 'src', 'index.html');
    const url = `file://${filePath}` 

    before(async function(){
        driver = await new Builder().forBrowser('firefox').setFirefoxOptions(options).build();
    })

    beforeEach(function(){
        totalTests ++;
    })

    afterEach(function(){

        if(this.currentTest.state === "passed"){
            passedTests ++;
        }
    })

    it('Page has 1 navbar brand', async function() {
        await driver.get(url);
        const navbarBrandElements = await driver.findElements(By.css('.navbar-brand'));
        expect(navbarBrandElements).to.have.lengthOf(1);
    });  

    
    it('Navbar brand text is "Shazada"', async function() {
        await driver.get(url);
        const navbarBrandElement = await driver.findElement(By.css('.navbar-brand'));
        const brandText = await navbarBrandElement.getText();
        expect(brandText).to.equal('Shazada');
    });  

    it('Page navbar should have at least 3 anchor tags', async function() {
        await driver.get(url);
        const navbarAnchors = await driver.findElements(By.css('.navbar a'));
        expect(navbarAnchors.length).to.at.least(3);
    });

    it('Navbar tags include Home, Products, and About', async function() {
        await driver.get(url);
        let navlinksText = [];
        const navlinks = await driver.findElements(By.css('.navbar a'));
    
        for(let i = 0; i<navlinks.length; i++){
            const link = navlinks[i]
            const text = await link.getText();
            navlinksText.push(text);
        }

        let expectedTexts = ["Home", "Products", "Contact"]

        expectedTexts.forEach((expectedText)=>{
            expect(navlinksText, "None of the navlinks passed test").to.include(expectedText);
        })
    });

    it('Page navbar background color is rgb(13, 110, 253)', async function() {
        await driver.get(url);
        const navbar = await driver.findElement(By.css('.navbar'));
        const backgroundColor = await navbar.getCssValue('background-color');
        expect(backgroundColor).to.equal('rgb(13, 110, 253)');
    });

    it('Page contains a heading with text "Contact Us"', async function() {
        await driver.get(url);
        const heading = await driver.findElements(By.xpath('//*[contains(text(), "Contact Us")]'));
        expect(heading).to.exist;
    });

    
    it('Page check if element with Contact Us text is an h1, h2, or h3', async function() {
        await driver.get(url);
        const heading = await driver.findElement(By.xpath('//*[contains(text(), "Contact Us")]'));
        
        const tagName = await heading.getTagName();
        const headingTags = ['h1', 'h2', 'h3'];

        let isHeading = headingTags.some((headingTag)=>{
            return headingTag === tagName;
        })

        expect(isHeading, `Element with text COntact us is not an h1, h2 or h3`).to.be.true;
    });

    it('Page has link to Facebook', async function() {
        await driver.get(url);
        const link = await driver.findElement(By.xpath('//a[contains(@href, "facebook")]'));

        expect(link, `No anchor tag has a link to facebook`).to.exist;
    });

    it('Page has link to LinkedIn', async function() {
        await driver.get(url);
        const link = await driver.findElement(By.xpath('//a[contains(@href, "linkedin")]'));

        expect(link, `No anchor tag has a link to LinkedIn`).to.exist;
    });

    
    it("Page has a contact form", async function(){

		await driver.get(url);
		const contactForms = await driver.findElements(By.css('form'))
		expect(contactForms.length).to.be.at.least(1);

	})



    it("Page has a contact form text input", async function(){

    	await driver.get(url);

    	const textInput = await driver.findElements(By.xpath('//input[contains(@type,"text")]'));
    	expect(textInput.length).to.be.at.least(1,'No contact form text input type found on the page')

    })

    

    it("Page has a contact form email input", async function(){

    	await driver.get(url);

    	const textInput = await driver.findElements(By.xpath('//input[contains(@type,"email")]'));
    	expect(textInput.length).to.be.at.least(1,'No contact form text input type found on the page')

    })

    

    it("Page has a contact form text field", async function(){

    	await driver.get(url);

    	const textInput = await driver.findElements(By.css('textarea'));
    	expect(textInput.length).to.be.at.least(1,'No contact form text input type found on the page')

    })



    it("Page has a submit button", async function() {
        await driver.get(url);
    
        const submitButtons = await driver.findElements(By.xpath('//button[contains(@type,"submit")]'));
    
        expect(submitButtons.length).to.be.at.least(1, 'No submit button found on the page');
    });



    after(async function(){
        await driver.quit()

        console.log("==================");
        console.log(`Test results: ${passedTests}/${totalTests}`);
        console.log(`Percentage: ${parseInt((passedTests/totalTests*100).toFixed(2))}%`)
        console.log("==================");

    })
})