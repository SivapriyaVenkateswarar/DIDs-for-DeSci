export function credentialWeight(vcType: string): number {
  switch (vcType) {
    case 'ResearchContribution':
      return 1.0;
    case 'DatasetContribution':
      return 0.8;
    default:
      return 0.5;
  }
}
