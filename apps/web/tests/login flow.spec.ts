import { test, expect } from '@playwright/test';

test('login', async ({ page }) => {
  let password = process.env.TEST_PASSWORD;
  let username = process.env.TEST_USERNAME;
  let apiURL = process.env.VITE_API_ENDPOINT;

  if (!password || !username) {
    throw new Error('No password or username set');
  }

  await page.goto('http://localhost:5173/login');
  await page.getByRole('button', { name: 'ROC Tilburg' }).click();
  const page1Promise = page.waitForEvent('popup');
  await page.getByRole('link', { name: 'Click here to get your token' }).click();
  const page1 = await page1Promise;
  await page1.waitForLoadState('load');
  await page1.getByText('Onderwijsgroep Tilburg').click();
  await page1.getByRole('textbox').fill(username);
  await page1.getByRole('button', { name: 'Next' }).click();
  await page1.getByPlaceholder('Password').fill(password);
  await page1.getByRole('button', { name: 'Sign in' }).click();
  await page1.getByRole('button', { name: 'Yes' }).click();

  const redirectUrl = (await page1.waitForResponse('https://login.educus.nl/samlsso/**')).headers().location;
  await page1.close();

  await page.getByRole('textbox').fill(await redirectUrl);
  await page.getByRole('button', { name: 'Submit' }).click();
  if (await (await page.waitForResponse(`${apiURL}/auth/login`)).status() !== 200) {
    throw new Error('Login failed');
  }
  await page.waitForLoadState('load');
  await page.getByRole('combobox').selectOption('desc');
  await page.getByRole('textbox').first().fill('2023-06-11');
  await page.getByRole('textbox').nth(1).fill('2023-06-19');
  await page.getByRole('heading', { name: 'SQL' }).click();
  await page.getByText('ka108', { exact: true }).first().click();
  await page.getByText('ka108-SQL-h2onweb1b,h2onweb1a-gmoo - SQL').click();
  await page.getByText('Fri Jun 16 2023 - 13:15').click();
});
