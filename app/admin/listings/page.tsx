import styles from '@/app/admin/page.module.css';
import Table from '@/components/Table';

export default function Home() {
  return (
    <main className={styles.main}>
      <Table />
    </main>
  );
}
