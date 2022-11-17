import { useEffect, memo } from "react";
import { useCallback, useMemo } from "react";
import { useState } from "react";
import * as articlesApi from "../api/articles";

export default memo(function Article({type}) {
  const [articles, setArticles] = useState([]);
  const filtered = useMemo(() => articles.find(el => el.name === type), [articles, type]);
  const detailedPrice = useMemo(() => articles.find(el => el.name === 'Background')?.extra, [articles]);
  const [total, setTotal] = useState(filtered?.price);

  const handleChange = useCallback(() => {
    const checkboxGroup = document.getElementById('characterAmountInput');
    const isDetailed = document.getElementById('backgroundCheck').checked;
    const amount = checkboxGroup && checkboxGroup.style.display !== 'none' ? parseInt(document.getElementById('extraCharacterAmount').value) : 0;
    const detail = isDetailed ? parseInt(detailedPrice) : 0;
    setTotal(parseInt(filtered?.price) + (amount * parseInt(filtered?.extra)) + detail);
  }, [filtered, detailedPrice]);

  useEffect(() => {
    const fetchArticles = async () => {
      const data = await articlesApi.getAll();
      setArticles(data);
    }

    fetchArticles();
  }, []);

  useEffect(() => {
    handleChange();
  }, [articles, handleChange])

  return (
    <div className="article">
      <h1>{filtered?.name}</h1>
      <h2>Create Order</h2>
      <form>
        <div className="form-group">
          <label className="form-label lbl" htmlFor="description">Description</label>
          <textarea className="form-control" id="description" rows="3" maxLength={300}></textarea>
        </div>
        <label className="form-label lbl">Attributes:</label>
        <div className="form-check">
          <input type="checkbox" className="form-check-input" id="backgroundCheck" onClick={handleChange}/>
          <label className="form-check-label" htmlFor="backgroundCheck">Detailed background</label>
        </div>
        {type.toLowerCase() !== 'background' && <CharacterArticle handleChange={handleChange}/>}
        <div className="form-group">
          <label className="form-label lbl" htmlFor="imageUrl">Reference:</label>
          <input type="text" className="form-control" id="imageUrl" placeholder="ImageUrl"/>
        </div>
        <div className="form-group">
          <label className="form-label lbl">Total:</label>
          <input type="text" className="form-control" id="totalprice" disabled value={`$${total}`}/>
        </div>
      </form>
    </div>
  );
});

const CharacterArticle = ({ handleChange }) => {
  const handleCharacterClick = useCallback((e) => {
    const checkboxGroup = document.getElementById('characterAmountInput');
    if(!e.currentTarget.checked) checkboxGroup.style.display = 'none';
    else checkboxGroup.style.display = 'block';
    handleChange();
  }, [handleChange])

  return (
    <>
      <div className="form-check">
        <input type="checkbox" className="form-check-input" id="extraCharacterCheck" onClick={handleCharacterClick}/>
        <label className="form-check-label" htmlFor="extraCharacterCheck">Extra character</label>
      </div>
      <div className="form-group" id="characterAmountInput" style={{display: 'none'}} onChange={() => handleChange()}>
        <label className="form-label lbl" htmlFor="extraCharacterAmount">Amount of extra characters:</label>
        <input type="number" defaultValue={1} min={1} max={3} className="form-control" id="extraCharacterAmount"/>
      </div>
    </>
  );
}