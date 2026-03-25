import { ShoppingList } from "@/components/ShoppingList";

export default function Home() {
  return (
    <main className="w-full bg-gray-50">
      <div className="container mx-auto sm:py-8 w-full md:w-1/2 lg:w-1/2 xl:w-1/2 2xl:w-1/3 md:my-10">
        <ShoppingList />
      </div>
    </main>
  );
}
