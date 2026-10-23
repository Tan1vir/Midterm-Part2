
import { useEffect, useState } from "react";
import "./Home.css";
import { Link } from "react-router-dom";

function Home() {
  const [pokemon, setPokemon] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchPokemon() {
      try {
        const response = await fetch(
          "https://pokeapi.co/api/v2/pokemon/?limit=20"
        );

        if (!response.ok) {
          throw new Error("Failed to fetch Pokémon");
        }

        const data = await response.json();

        const pokemonDetails = await Promise.all(
          data.results.map(async (item) => {
            const detailsResponse = await fetch(item.url);

            if (!detailsResponse.ok) {
              throw new Error("Failed to fetch Pokémon details");
            }

            return detailsResponse.json();
          })
        );

        setPokemon(pokemonDetails);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchPokemon();
  }, []);

  if (loading) {
    return <h2>Loading Pokémon...</h2>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }
  

  return (
    <main className="home">
      <h1>Pokémon Explorer</h1>
      <p>Discover Pokémon and learn about their abilities.</p>

      
<div className="pokemon-grid">
  {pokemon.map((item) => (
    <Link
  to={`/pokemon/${item.name}`}
  className="pokemon-card"
  key={item.id}
>
  <img
  src={
    item.sprites.other["official-artwork"].front_default ||
    item.sprites.front_default
  }
  alt={item.name}
/>

  <h2>
    {item.name.charAt(0).toUpperCase() +
      item.name.slice(1)}
  </h2>

  <p>
    Type: {item.types
      .map((type) => type.type.name)
      .join(", ")}
  </p>
</Link>
  ))}
</div>

    </main>
  );
}

export default Home;
