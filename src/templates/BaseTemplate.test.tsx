import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-react';
import { page } from 'vitest/browser';
import { BaseTemplate } from './BaseTemplate';

describe('Base template', () => {
  describe('Render method', () => {
    it('renders menu items correctly', async () => {
      await render(
        <BaseTemplate
          leftNav={
            <>
              <li>link 1</li>
              <li>link 2</li>
              <li>link 3</li>
            </>
          }
        >
          {null}
        </BaseTemplate>,
      );

      const menuItemList = page.getByRole('listitem');

      expect(menuItemList.elements()).toHaveLength(3);
    });

    it('contains initiative builder tag', async () => {
      await render(
        <BaseTemplate leftNav={<li>1</li>}>{null}</BaseTemplate>,
      );

      const copyrightSection = page.getByText(/© /u);
      expect(copyrightSection).toBeInTheDocument();
    });
  });
});
