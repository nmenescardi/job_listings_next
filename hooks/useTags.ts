import useSWR, { mutate } from 'swr';
import { API_DOMAIN, fetcher, swrOptions } from '@/hooks/common';
import axios from '@/utils/axios';
import { TagModel } from '@/utils/types';

type TagResponse = {
  status: 'success' | 'error';
  data?: TagModel | number;
  error?: any;
};

const useTags = () => {
  const { data, isLoading, error } = useSWR(
    `${API_DOMAIN}/tags`,
    fetcher,
    swrOptions
  );

  return { data, isLoading, error };
};

export default useTags;

export const useTagsWithAliases = () => {
  const { data, isLoading, error } = useSWR(
    `${API_DOMAIN}/tagsWithAliases`,
    fetcher,
    swrOptions
  );

  return { data, isLoading, error };
};

export const useDeleteTag = () => {
  const deleteTag = async (tagId: number): Promise<TagResponse> => {
    try {
      await axios.delete(`/api/tags/${tagId}`);

      // Update cache locally without making an extra API call
      mutate<TagModel[]>(`${API_DOMAIN}/tagsWithAliases`, (currentTags) => {
        return (currentTags || []).filter((tag) => tag.id !== tagId);
      });

      return { status: 'success', data: tagId };
    } catch (error) {
      console.error('Error deleting tag:', error);
      // Handle error appropriately, e.g., show a notification or set an error state

      return { status: 'error', error };
    }
  };

  return deleteTag;
};

export const useAddTag = () => {
  const addTag = async (newTag: TagModel): Promise<TagResponse> => {
    try {
      await axios.post(`/api/tags`, newTag);

      // Update cache locally without making an extra API call
      mutate<TagModel[]>(`${API_DOMAIN}/tagsWithAliases`, (currentTags) => {
        return [...(currentTags || []), newTag];
      });

      return { status: 'success', data: newTag };
    } catch (error) {
      console.error('Error adding tag:', error);

      return { status: 'error', error };
    }
  };

  return addTag;
};

export const useEditTag = () => {
  const editTag = async (tag: TagModel): Promise<TagResponse> => {
    try {
      await axios.put(`/api/tags/${tag.id}`, tag);

      mutate<TagModel[]>(`${API_DOMAIN}/tagsWithAliases`, (currentTags) => {
        return [...(currentTags || []), tag];
      });

      return { status: 'success', data: tag };
    } catch (error) {
      console.error('Error adding tag:', error);

      return { status: 'error', error };
    }
  };

  return editTag;
};
