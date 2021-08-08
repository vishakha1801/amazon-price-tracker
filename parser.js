require('dotenv').config()
const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const nightmare = require('nightmare')()

// const args = process.argv.slice(2)
// const url = args[0]
// const minPrice = args[1]

const [, , url, minPrice] = process.argv

checkPrice()

async function checkPrice() {
    try {
        const priceString = await nightmare.goto(url)
                                            .wait("#priceblock_ourprice")
                                            .evaluate(() => document.getElementById("priceblock_ourprice").innerText)
                                            .end()
        const priceNumber = priceString.replace('₹','');
        const priceNumber_whole = parseFloat(priceNumber.replace(',',''));
        if (priceNumber < minPrice) {
            sendEmail(
                'Price is Low',
                `The price on ${url} has dropped below ${minPrice}`
            )
        } 
    } catch(e) {
        sendEmail('Amazon Price Checker Error', e.message)
    }
}

function sendEmail(subject, body) {
    const email = {
        to: 'vishakhamanojpathak18@gmail.com',
        from: 'vishakhamanojpathak18@gmail.com',
        subject: subject,
        text: body, 
        html: body
    }
    return sgMail.send(email)
}