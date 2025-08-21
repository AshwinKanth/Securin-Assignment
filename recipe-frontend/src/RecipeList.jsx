import React, {useEffect, useState} from 'react';
import axios from 'axios';

export default function RecipeList(){
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);
  const [query, setQuery] = useState('');
  const [cuisine, setCuisine] = useState('');

  const fetch = () => {
    setLoading(true);
    const params = { page, limit };
    if (query) params.title = query;
    if (cuisine) params.cuisine = cuisine;
    axios.get('http://localhost:5000/api/recipes', { params })
      .then(res => {
        setRecipes(res.data.data || []);
        setTotal(res.data.total || 0);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }

  useEffect(()=> { fetch(); }, [page, limit]);

  const onSearch = () => {
    setPage(1);
    // call search endpoint for filters
    setLoading(true);
    const params = { page:1, limit, title: query, cuisine };
    axios.get('http://localhost:5000/api/recipes/search', { params })
      .then(res => {
        setRecipes(res.data.data || []);
        setTotal(res.data.total || 0);
        setLoading(false);
      }).catch(err => { console.error(err); setLoading(false); });
  }

  if(loading) return <div>Loading...</div>;
  if(recipes.length===0) return <div>No recipes found</div>;
  return (
    <div>
      <div style={{marginBottom:10}}>
        <input placeholder="Search title" value={query} onChange={e=>setQuery(e.target.value)} />
        <input placeholder="Cuisine" value={cuisine} onChange={e=>setCuisine(e.target.value)} style={{marginLeft:6}} />
        <button onClick={onSearch} style={{marginLeft:6}}>Search</button>
        <label style={{marginLeft:12}}>Per page:
          <select value={limit} onChange={e=>setLimit(parseInt(e.target.value))} style={{marginLeft:6}}>
            <option value={10}>10</option>
            <option value={15}>15</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </select>
        </label>
      </div>
      <h2>Available Recipes ({total})</h2>
      <ul>
        {recipes.map(r => (
          <li key={r.id} style={{marginBottom:15, padding:10, border:'1px solid #ddd', borderRadius:6}}>
            <h3>{r.title}</h3>
            <p><b>Cuisine:</b> {r.cuisine} <b> | </b> <b>Category:</b> {r.category}</p>
            <p><b>Ingredients:</b> {r.ingredients}</p>
            <p><b>Instructions:</b> {r.instructions}</p>
          </li>
        ))}
      </ul>
      <div style={{marginTop:12}}>
        <button disabled={page<=1} onClick={()=>setPage(p=>p-1)}>Prev</button>
        <span style={{margin:'0 8px'}}>Page {page}</span>
        <button disabled={page*limit>=total} onClick={()=>setPage(p=>p+1)}>Next</button>
      </div>
    </div>
  )
}
