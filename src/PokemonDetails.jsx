
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import "./PokemonDetails.css";

function PokemonDetails() {
  const { name } = useParams();

  const [pokemon, setPokemon] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchPokemonDetails() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `https://pokeapi.co/api/v2/pokemon/${name}`
        );

        if (!response.ok) {
          throw new Error("Pokémon not found");
        }

        const data = await response.json();
        setPokemon(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchPokemonDetails();
  }, [name]);

  if (loading) {
    return <h2 className="details-status">Loading Pokémon details...</h2>;
  }

  if (error) {
    return (
      <main className="details-container">
        <p className="details-error">{error}</p>
        <Link to="/">Back to Home</Link>
      </main>
    );
  }

  return (
    <main className="details-container">
      <Link to="/" className="back-link">
        ← Back to Home
      </Link>

      <section className="details-card">
        <img
          className="details-image"
          src={
            pokemon.sprites.other["official-artwork"].front_default ||
            pokemon.sprites.front_default
          }
          alt={pokemon.name}
        />

        <h1>
          {pokemon.name.charAt(0).toUpperCase() +
            pokemon.name.slice(1)}
        </h1>

        <div className="details-info">
          <p>
            <strong>Type:</strong>{" "}
            {pokemon.types
              .map((item) => item.type.name)
              .join(", ")}
          </p>

          <p>
            <strong>Height:</strong> {pokemon.height / 10} m
          </p>

          <p>
            <strong>Weight:</strong> {pokemon.weight / 10} kg
          </p>

          <p>
            <strong>Base Experience:</strong>{" "}
            {pokemon.base_experience ?? "Not available"}
          </p>
        </div>

        <h2>Abilities</h2>

        <div className="abilities-list">
          {pokemon.abilities.map((item) => (
            <span className="ability" key={item.ability.name}>
              {item.ability.name.replace("-", " ")}
              {item.is_hidden && " (Hidden)"}
            </span>
          ))}
        </div>
      </section>
    </main>
  );
}

export default PokemonDetails;
