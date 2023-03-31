import SignInForm from '@/components/Auth/SignInForm';

export default function SingInForm() {
  return (
    <section className="bg-gray-50 dark:bg-gray-900">
      <div className="flex flex-col items-center justify-center px-6  mx-auto h-screen lg:py-0">
        <SignInForm />
      </div>
    </section>
  );
}
