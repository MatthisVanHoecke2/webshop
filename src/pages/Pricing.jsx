import { useState, useEffect, memo } from "react";
import { Link } from "react-router-dom";
import * as articlesApi from '../api/articles';
import { getErrorMessage } from "../components/GeneralMethods";
import { useMessage } from "../contexts/DialogProvider";

const Pricing = () => {
  const [articles, setArticles] = useState([]);
  const {setMessage, setMessageTitle, setShowMessage} = useMessage();
  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const background = await articlesApi.getById(1);
        const character = await articlesApi.getById(2);
        setArticles([background, character]);
      }
      catch (err) {
        const error = getErrorMessage(err);
        setMessageTitle('Error');
        setMessage(error.message);
        setShowMessage(true);
      }
    }
    fetchArticles();
  }, [setMessage, setMessageTitle, setShowMessage]);
  return (
    <>
    {articles.map((el, index) => (<PriceCard location={!el.type ? el.name.toLowerCase() : el.type === 'base' ? 'character' : el.type } cardData={el} key={index}/>))}
    </>
  );
}

const PriceCard = memo(({location, cardData}) => {
  const {imageUrl, name, description, price} = cardData;
  return (
    <div className="card items zoom" data-cy='pricing_card'>
      <img src={`${process.env.PUBLIC_URL}/resources/images/${imageUrl}`} alt={name} className="card-img-top rounded"/>
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
  }, [])
  const newArr = [...characters];
  newArr.splice(newArr.findIndex(el => el.type === 'base'), 1);

  return (
    <>
    {newArr.map((el, index) => (<PriceCard location={`character/${el.type.toLowerCase()}`} cardData={el} key={index}/>))}
    </>
  );
}

export {Pricing, Character};