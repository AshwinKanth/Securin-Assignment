import React from 'react'
import RecipeList from './RecipeList'

export default function App(){
  return (
    <div style={{padding:20, fontFamily:'Arial'}}>
      <h1>🍲 Recipe Collection</h1>
      <RecipeList />
    </div>
  )
}
