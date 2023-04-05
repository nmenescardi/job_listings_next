import { Provider } from '@/utils/types';

export const providers: Provider[] = [
  { value: 'LinkedIn', label: 'LinkedIn' },
  { value: 'Indeed', label: 'Indeed' },
  { value: 'Larajobs', label: 'Larajobs' },
  { value: 'Glassdoor', label: 'Glassdoor' },
  { value: 'RemoteCo', label: 'RemoteCo' },
  { value: 'RemoteOk', label: 'RemoteOk' },
  { value: 'Remotive', label: 'Remotive' },
  { value: 'WeWorkRemotely', label: 'WeWorkRemotely' },
  { value: 'ZipRecruiter', label: 'ZipRecruiter' },
  { value: 'SimplyHired', label: 'SimplyHired' },
  { value: 'CareerBuilder', label: 'CareerBuilder' },
  { value: 'ThemUse', label: 'ThemUse' },
  { value: 'Lensa', label: 'Lensa' },
];

export const providersList = providers.map((provider) => provider.value);
