import Image from 'next/image';

export default function Page() {
  return (
    <main className="flex min-h-screen flex-col p-6 block md:items-center md:justify-center w-full h-full bg-gray-100">
        <div className="w-[60%] h-[60%] mx-auto py-10 flex rounded-lg px-6 md:w-2/5 md:px-20 border-2 border-gray-300/75 bg-kulonfeher-100 shadow-lg">
          <p className={`text-xl text-black-800 md:text-3xl md:leading-normal`}>
             <Image src="/content.webp" alt="ReChef" width={500} height={300} /><br/>Ez lesz majd az alap.
          </p>
        </div>
    </main>
  );
}
