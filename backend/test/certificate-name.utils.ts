export function getHonorific(gender?: string | null): string {
  const normalized = (gender ?? '').trim().toLowerCase();

  switch (normalized) {
    case 'male':
      return 'Mr.';
    case 'female':
      return 'Ms.';
    case 'non-binary':
    case 'nonbinary':
    case 'non binary':
    case 'they':
    case 'they/them':
    case 'they them':
      return 'Mx.';
    default:
      return '';
  }
}

export function getPronounSet(gender?: string | null) {
  const normalized = (gender ?? '').trim().toLowerCase();

  if (normalized === 'male') {
    return {
      subject: 'he',
      object: 'him',
      possessive: 'his',
      reflexive: 'himself',
    };
  }

  if (normalized === 'female') {
    return {
      subject: 'she',
      object: 'her',
      possessive: 'her',
      reflexive: 'herself',
    };
  }

  return {
    subject: 'they',
    object: 'them',
    possessive: 'their',
    reflexive: 'themself',
  };
}

export function formatCertificateName(
  firstName?: string | null,
  lastName?: string | null,
  gender?: string | null,
): string {
  const fullName = [firstName, lastName].filter(Boolean).join(' ').trim();
  const honorific = getHonorific(gender);

  if (!fullName) return '';
  return honorific ? `${honorific} ${fullName}`.trim() : fullName;
}

export function formatCertificateSurname(
  lastName?: string | null,
  gender?: string | null,
): string {
  const surname = (lastName ?? '').trim();
  const honorific = getHonorific(gender);

  if (!surname) return '';
  return honorific ? `${honorific} ${surname}`.trim() : surname;
}
