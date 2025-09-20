import basicSetup from '../wallet-setup/basic.setup';
import {testWithSynpress} from '@synthetixio/synpress';
import { MetaMask,metaMaskFixtures } from '@synthetixio/synpress/playwright';

const test = testWithSynpress(metaMaskFixtures(basicSetup));
const { expect } = test;

test('has title', async ({ page }) => {
  await page.goto('/');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/tsender/);
});

test("should show the airdrop form when connected, otherwise, not", async ({ page, context,metamaskPage , extensionId }) => {
  await page.goto('/');
  await expect(page.getByText("Connect Wallet")).toBeVisible();

  const metamask = new MetaMask(context, metamaskPage, basicSetup.password, extensionId);
  await page.getByTestId('rk-connect-button').click();
  await page.getByTestId('rk-wallet-option-io.metamask').waitFor({
    state: 'visible',
    timeout: 30000, 
  });
  await page.getByTestId('rk-wallet-option-io.metamask').click();
  await metamask.connectToDapp();
});
