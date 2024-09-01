import { test, expect } from '@playwright/test';
import exp from 'constants';
import { LoginPage } from './pageObjects/loginPage';

test('test mercado libre', async ({ page }) => {

  await page.goto('https://www.mercadolibre.com.pe/')
  await page.locator('input[id=\'cb1-edit\']').fill("Iphone")
  await page.keyboard.press('Enter'); //accion Enter

  await expect(page.locator('//ol[contains(@class,\'ui-search-layout\')]')).toBeVisible() //Esperar hasta que sea visible

  const titles = await page.locator('//ol[contains(@class,\'ui-search-layout\')]//li//h2').allInnerTexts() //Sacar textos del elemento
  console.log(titles.length)

  for(let title of titles){
    console.log(title)
  }

});

test('test Saucemo Page Object', async ({ page }) => {

  await page.goto('https://www.saucedemo.com/')

  const login = new LoginPage(page)
  await login.loginWithCredencial('standard_user','secret_sauce')



});


test('Test Saucedemo', async ({ page }) => {

  await page.goto('https://www.saucedemo.com/')

  await page.getByRole('textbox', {name: 'Username'}).fill('standard_user')
  await page.getByRole('textbox', {name: 'Password'}).fill('secret_sauce')
  await page.getByRole('button',  {name:'LOGIN'}).click()


  const itemsContainer = await page.locator('#inventory_container .inventory_item').all()


  const randomIndex = Math.floor(Math.random()* itemsContainer.length)

  const randomItem = itemsContainer[randomIndex]
  
  const expectName = await randomItem.locator('.inventory_item_name').innerText()
  const expectPrice = await randomItem.locator('.inventory_item_price').innerText()
  
  await randomItem.getByRole('button', {name: 'Add to cart'}).click()


  await page.locator('a.shopping_cart_link').click()

  expect(page.getByRole('button', {name: 'Checkout'})).toBeVisible()

  const nameCart = await page.locator('.inventory_item_name').innerText();
  const priceCart = await page.locator('.inventory_item_price').innerText();
  
  if(expectName ==  nameCart && expectPrice == priceCart){
    console.log('El item fue agregado correctamente')
    await page.getByRole('button', {name:'Checkout'}).click()

    expect(page.getByRole('button',{name:'Continue'})).toBeVisible()

    await page.getByRole('textbox', {name:'First Name'}).fill('Fernando')
    await page.getByRole('textbox', {name: 'Last Name'}).fill('Lopez')
    await page.getByRole('textbox', {name: 'Zip/Postal Code'}).fill('000')

    await page.getByRole('button', {name: 'Continue'}).click()

    expect(page.getByRole('button', {name: 'Finish'})).toBeVisible()

    await page.getByRole('button', {name: 'Finish'}).click()

    const mensaje = await page.locator('.complete-header').innerText()
    console.log(mensaje)


  }else{
    console.log('El item no fue agregado correctamente')
  }

});

