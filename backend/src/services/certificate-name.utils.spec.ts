import { getPronounSet } from './certificate-name.utils';

describe('getPronounSet', () => {
  it('returns male pronouns', () => {
    expect(getPronounSet('Male')).toEqual({
      subject: 'he',
      object: 'him',
      possessive: 'his',
      reflexive: 'himself',
    });
  });

  it('returns non-binary pronouns', () => {
    expect(getPronounSet('Non-binary')).toEqual({
      subject: 'they',
      object: 'them',
      possessive: 'their',
      reflexive: 'themself',
    });
  });

  it('falls back to neutral values', () => {
    expect(getPronounSet('Unknown')).toEqual({
      subject: 'they',
      object: 'them',
      possessive: 'their',
      reflexive: 'themself',
    });
  });
});
