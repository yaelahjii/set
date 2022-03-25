const puppeteer = require('puppeteer');
const readFileSync = require('readline-sync');
const chalk = require('chalk');
const figlet = require('figlet');

(async () => {
  const urlgas = ('https://ksps.co.id/eksternal/site/login');
  const browser = await puppeteer.launch({
    headless: true,
  });
  //colours
  const pink = chalk.magenta.bold;
  const white = chalk.white.bold;  
  const red = chalk.red.bold;
  const green = chalk.green.bold;
  const yellow = chalk.yellow.bold;
  const blue = chalk.blue.bold;
  const cyan = chalk.cyan.bold;

  console.log(pink(figlet.textSync('Absen', {
    font: 'ghost',
    horizontalLayout: 'default',
    verticalLayout: 'default',
    width: 80,
    whitespaceBreak: true
})));

  const context = browser.defaultBrowserContext();

  const options = {waitUntil: 'networkidle2'}
  context.clearPermissionOverrides();
  context.overridePermissions(urlgas.origin, ['geolocation']);
  const page = await context.newPage();
  await page.setUserAgent('Mozilla/5.0 (Linux; Android 11; M2010J19CG) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.45 Mobile Safari/537.36');
  //go to url
  await page.goto(urlgas, options);
  var username = readFileSync.question(pink("Username: "))
  var password = readFileSync.question(pink("Password: "),{ hideEchoBack: true })

  // Login Form username
  
  console.log(red("M")+green("e")+yellow("n")+blue("c")+pink("o")+cyan("b")+red("a")+green("L")+yellow("o")+blue("g")+pink("i")+cyan("n"));
  const emailLu = await page.$('#loginform-username')
  await emailLu.type(username)
  await emailLu.dispose()

  //Login Form Password

  const PasswordLu = await page.$('#loginform-password')
  await PasswordLu.type(password)
  await PasswordLu.dispose()

  //btnSubmit
  const btnSubmit = await page.$('button[type=submit]')
  await btnSubmit.click()
  await btnSubmit.dispose()
  await page.waitForNavigation()
  
  if (page.url() == 'https://ksps.co.id/eksternal/')
  {
    console.log(pink("Sukses Login!"));

    //go to absen

    await page.goto("https://ksps.co.id/eksternal/absen/remote");
  await page.waitForTimeout(3000);
  await page.click("#geocoding_form > div > div > button");
  const granted = await page.evaluate(async () => {
    return (await navigator.permissions.query({name: 'geolocation'})).state;
  });

  //allow location

  console.log(pink('Allow Location:',green(granted)));
  console.log(pink('Absen:')+cyan('Masuk/Pulang'));

  //absen masuk
  
  const absen = readFileSync.question(pink("Absen: "))
  if (absen === 'Masuk') {
    console.log(pink("Memproses absen Masuk . . ."))
  
  await page.waitForTimeout(3000);
  await page.keyboard.press('ArrowDown');
  await page.click("#w0 > div:nth-child(4) > button");
  console.log(pink("Sukses Absen Masuk"))
  }
  //absen pulang
  else{ (absen === 'Pulang') 
    console.log(pink("Memproses absen Pulang . . ."))
  
  await page.waitForTimeout(3000);
  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('ArrowDown');
  await page.click("#w0 > div:nth-child(4) > button");
  console.log(red("Sukses")+yellow("Absen")+green("Pulang"))
  await page.waitForTimeout(3000);
  }
  await browser.close();
  }else{
    console.log(pink("Gagal Login!"));
    await browser.close();
  }
})();