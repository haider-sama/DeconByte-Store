import Hero from "./components/Hero/Hero";
import Container from "./components/Container";
import { ProductCart } from "./components/products/ProductCard";
import getProducts, { getProductParams }  from "@/actions/getProducts";
import NullData from "./components/NullData";

interface HomeProps{
  searchParams: getProductParams;
}

export default async function Home({searchParams} : HomeProps) {
  const products = await getProducts(searchParams);

  if(products.length === 0) {
    return <NullData title='Oops! No products found. Click "All" to clear filters'/>
  }

  // Fisher-Yates Shuffle Algorithm
  function shuffleArray(array: any) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }

    return array;
  }

  const shuffledProducts = shuffleArray([...products]);

  return (
    <div className="p-8">
      <Container>
        <div>
          <Hero />
          <div className="grid grid-cols-2 sm:grid-cols-3
          lg:grid-cols-6 xl:grid-cols-5 2xl:grid-cols-6 gap-8">
            {shuffledProducts.map((product: any) => {
                return <ProductCart key={product.id} data={product}/>
            })}
          </div>
        </div>
      </Container>
    </div>
  );
}
