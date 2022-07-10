import { useEffect, useState } from 'react';
import './App.css';
import { Card } from './components/Card/Card';
import { Navbar } from './components/Navbar/Navbar';
import { getAllPokemon, getPokemon } from './utils/pokemon';

function App() {
  const initialURL = "https://pokeapi.co/api/v2/pokemon/";
  const [loading, setLoading] = useState(true);
  const [pokemonData, setPokemonData] = useState([])
  const [nextUrl, setNextUrl] = useState('')
  const [prevUrl, setPrevUrl] = useState('')

  useEffect(() => {
    const fetchPokemonData = async () => {
      const res = await getAllPokemon(initialURL);
      await loadPokemon(res.results);
      setLoading(false);
      setNextUrl(res.next)
      setPrevUrl(res.previous)
    }
  
    fetchPokemonData();
  }, [])

  const loadPokemon = async (data) => {
    const _pokemonData = await Promise.all(
      data.map(pokemon => {
        const pokemonRecord = getPokemon(pokemon.url);
        return pokemonRecord
      })
    )
    setPokemonData(_pokemonData);
  }
  // 

  const handlePrevPage = async () => {
    if (!prevUrl) return;

    setLoading(true);
    const res = await getAllPokemon(prevUrl)
    await loadPokemon(res.results);
    setLoading(false);
    setNextUrl(res.next)
    setPrevUrl(res.previous)
  }
  const handleNextPage = async () => {
    if (!nextUrl) return;

    setLoading(true);
    const res = await getAllPokemon(nextUrl)
    await loadPokemon(res.results);
    setLoading(false);
    setNextUrl(res.next)
    setPrevUrl(res.previous)
  }

  return (
    <>
      <Navbar />
      <div className="App">
        {loading ? (
            <h1>ロード中。。。。</h1>
          ) : (
            <>
              <div className='pokemonCardContainer'>
                {pokemonData.map((pokemon, i) => {
                  return <Card key={i} pokemon={pokemon} />
                })}
              </div>
              <div className='btn'>
              <button onClick={handlePrevPage}>前へ</button>
              <button onClick={handleNextPage}>次へ</button>
              </div>
            </>
          )}
      </div>
    </>
  );
}

export default App;
