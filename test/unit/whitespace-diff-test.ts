import {
  builders as b,
} from 'glimmer-engine/dist/node_modules/glimmer-syntax';
import assert from 'test/helpers/assert';

import repeat from 'ember-template-rewrite/utils/repeat';
import whitespaceDiff from 'ember-template-rewrite/utils/whitespace-diff';

describe('Unit: whitespaceDiff', () => {
  describe('with overlap', () => {
    it('on same line', () => {
      const locA = b.loc(1, 30, 1, 39);
      const locB = b.loc(1, 30, 1, 32);
      const actual = whitespaceDiff(locA, locB);
      const expected = '';
      assert.equal(actual, expected);
    });

    it('spanning multiple lines', () => {
      const locA = b.loc(1, 30, 1, 39);
      const locB = b.loc(1, 30, 2, 32);
      const actual = whitespaceDiff(locA, locB);
      const expected = '';
      assert.equal(actual, expected);
    });
  });

  describe('with no gap', () => {
    it('on same line', () => {
      const locA = b.loc(1, 53, 1, 39);
      const locB = b.loc(1, 39, 1, 45);
      const actual = whitespaceDiff(locA, locB);
      const expected = '';
      assert.equal(actual, expected);
    });

    it('spanning multiple lines', () => {
      const locA = b.loc(1, 30, 2, 39);
      const locB = b.loc(2, 39, 3, 32);
      const actual = whitespaceDiff(locA, locB);
      const expected = '';
      assert.equal(actual, expected);
    });
  });

  describe('with no overlap', () => {
    it('on same line', () => {
      const locA = b.loc(1, 30, 1, 39);
      const locB = b.loc(1, 45, 1, 50);
      const actual = whitespaceDiff(locA, locB);
      const expected = repeat(' ', 6);
      assert.equal(actual, expected);
    });

    it('spanning multiple lines', () => {
      const locA = b.loc(1, 5, 2, 10);
      const locB = b.loc(3, 15, 4, 3);
      const actual = whitespaceDiff(locA, locB);
      const expected = `\n${repeat(' ', 15)}`;
      assert.equal(actual, expected);
    });
  });
});
