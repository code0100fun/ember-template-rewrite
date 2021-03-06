import assert from 'test/helpers/assert';
import {
  preprocess as p,
} from 'test/helpers/print-equal';

import classStringParser from 'ember-template-rewrite/class-string-parser';
import { offsetNode } from 'ember-template-rewrite/utils/node';

function classConcat(source) {
  const expected = `<p class="${source}"></p>`;
  const concat = p(expected).body[0].attributes[0].value;
  offsetNode(concat, { column: -10, line: 0 }, { recursive: true });
  return concat.parts;
}

describe('Unit: classStringParser', () => {
  it('single binding', () => {
    const actual = classStringParser('foo');
    const expected = classConcat('{{foo}}');
    assert.equal(actual.length, 1);
    assert.includeDeepMembers(actual, expected);
  });

  it('multiple binding', () => {
    const actual = classStringParser('foo  bar');
    const expected = classConcat('{{foo}}  {{bar}}');
    actual[1].loc = null;
    assert.equal(actual.length, 3);
    assert.includeDeepMembers(actual, expected);
  });

  it('mixed types', () => {
    const actual = classStringParser(':a  b c::d e:f:g');
    const expected = classConcat('a  {{b}} {{unless c "d"}} {{if e "g" "g"}}');
    assert.equal(actual.length, 6);
    actual[0].loc = null;
    actual[2].loc = null;
    actual[4].loc = null;
    assert.includeDeepMembers(actual[3], expected[3]);
  });

  it('single ternary', () => {
    const actual = classStringParser('foo:bar:baz');
    const expected = classConcat('{{if foo "bar" "baz"}}');
    assert.equal(actual.length, 1);
    assert.includeDeepMembers(actual, expected);
  });

  it('single ternary with special chars', () => {
    const actual = classStringParser('a.foo:is-bar:is-baz');
    const expected = classConcat('{{if a.foo "is-bar" "is-baz"}}');
    assert.equal(actual.length, 1);
    assert.includeDeepMembers(actual, expected);
  });

  it('single binary', () => {
    const actual = classStringParser('foo:bar');
    const expected = classConcat('{{if foo "bar"}}');
    assert.equal(actual.length, 1);
    assert.includeDeepMembers(actual, expected);
  });

  it('static class', () => {
    const actual = classStringParser(':bar-baz');
    const expected = [{
      chars: 'bar-baz',
      type: 'TextNode',
    }];
    assert.equal(actual.length, 1);
    assert.includeDeepMembers(actual, expected);
  });

  it('mixed static ternary binding', () => {
    const actual = classStringParser(':is-static isActive:active:inactive bound');
    const expected = classConcat('is-static {{if isActive "active" "inactive"}} {{bound}}');
    assert.equal(actual.length, 4);
    actual[0].loc = null;
    actual[2].loc = null;
    assert.includeDeepMembers(actual, expected);
  });
});
