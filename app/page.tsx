'use client';
import styles from './page.module.css';
import Table from '@/components/Table';
import { listings } from '@/data/listings';

export default function Home() {
  return (
    <main className={styles.main}>
      <Table listings={listings} />
    </main>
  );
}
