export default async function Home() {
  const res = await fetch("http://127.0.0.1:8000/api/hello/");
  const data = await res.json();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-3xl font-bold">Next.js + Django</h1>
      <p>{data.message}</p>
    </main>
  );
}
