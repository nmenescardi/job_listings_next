import { MultiValue } from 'react-select';

export type Listing = {
  title: string;
  salary_range: string;
  provider: string;
  created_at: string;
  tags: string[];
  location: string;
  external_link?: string;
};

export interface Tags {
  value: string;
  label: string;
}

export interface Provider {
  value: string;
  label: string;
}

export type FiltersType = {
  onlyRemote?: boolean;
  provider?: MultiValue<Provider>;
  tags?: MultiValue<Tags>;
};

export type PaginationType = {
  currentPage?: number;
  lastPage?: number;
  total?: number;
};

export interface TagModel {
  id?: number;
  name: string;
  type: string;
  aliases?: {
    id?: number;
    alias: string;
  }[];
}
