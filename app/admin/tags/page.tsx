import React from 'react';
import TagsTable from '@/components/TagsTable';
import styles from '@/app/admin/page.module.css';

const TagsPage = () => {
  return (
    <div className={styles.main}>
      <TagsTable />
    </div>
  );
};

export default TagsPage;
