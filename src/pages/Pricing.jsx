import { useState, useEffect, memo } from "react";
import { Link } from "react-router-dom";
import * as articlesApi from '../api/articles';

const Pricing = () => {
  const [articles, setArticles] = useState([]);
  useEffect(() => {
    const fetchArticles = async () => {
      const background = await articlesApi.getById(1);
      const character = await articlesApi.getById(2);
      setArticles([background, character]);
    }
    fetchArticles();
  }, [])
  return (
    <>
    {articles.map((el, index) => (<PriceCard location={el.type?el.type:el.name.toLowerCase()} cardData={el} key={index}/>))}
    </>
  );
}

const PriceCard = memo(({location, cardData}) => {
  const {imageUrl, name, description, price} = cardData;
  return (
    <div className="card items zoom">
      <img src={imageUrl} alt={name} className="card-img-top rounded"/>
      <div className="card-body">
        <h1 className="card-title">{name}</h1>
        <p className="card-text">{description}</p>
        <p className="card-text">${price}</p>
        <Link to={`/pricing/${location}`} className="stretched-link" />
      </div>
    </div>
  );
});

const Character = () => {
  const [characters, setCharacters] = useState([]);
  useEffect(() => {
    const fetchCharacters = async () => {
      const data = await articlesApi.getAllPortraits();
      setCharacters(data)
    }
    fetchCharacters();
  })
  const newArr = [...characters];
  newArr.splice(newArr.findIndex(el => el.Type === 'base'), 1);

  return (
    <>
    {newArr.map((el, index) => (<PriceCard location={`character/${el.name.toLowerCase().replace(/\s/g, '')}`} cardData={el} key={index}/>))}
    </>
  );
}

export {Pricing, Character};