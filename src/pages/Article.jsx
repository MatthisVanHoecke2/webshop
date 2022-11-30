import { useEffect, memo } from "react";
import { useCallback, useMemo } from "react";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import * as articlesApi from "../api/articles";
import { CheckboxInput, LabelInput, TextareaInput } from "../components/FormComponents";

const validationRules = {
  description: {
    required: "Description is required"
  }
}

export default memo(function Article({type}) {
  const [articles, setArticles] = useState([]);
  const filtered = useMemo(() => articles.find(el => el.Type === type || el.name === type), [articles, type]);
  const detailedPrice = useMemo(() => articles.find(el => el.name === 'Background')?.extra, [articles]);
  const [total, setTotal] = useState(filtered?.price);
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [hideCheckbox, setHideCheckbox] = useState(true);
  const [extraCharacter, setExtraCharacter] = useState(1);
  const [detailed, setDetailed] = useState(false);

  const handleChange = useCallback(() => {
    const amount = !hideCheckbox ? extraCharacter : 0;
    const detail = detailed ? parseInt(detailedPrice) : 0;
    setTotal(parseInt(filtered?.price) + (amount * parseInt(filtered?.extra)) + detail);
  }, [filtered, detailedPrice, extraCharacter, hideCheckbox, detailed]);

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

  const onSubmit = async () => {

  }

  return (
    <div className="article">
      <h1>{filtered?.name}</h1>
      <h2>Create Order</h2>
      <FormProvider onSubmit={handleSubmit} errors={errors} register={register}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <TextareaInput label="Description" name="description" lblclass="form-label lbl" rows="3" maxLength={300} validationRules={validationRules}/>
          <label className="form-label lbl">Attributes:</label>
          <CheckboxInput label="Detailed background" name="backgroundCheck" validationRules={validationRules} onClick={(e) => { handleChange(); setDetailed(e.currentTarget.checked)}}/>
          {type.toLowerCase() !== 'background' && <CharacterArticle handleChange={handleChange} hideCheckbox={hideCheckbox} setHideCheckbox={setHideCheckbox} setExtraCharacter={setExtraCharacter}/>}
          <LabelInput label="Reference:" name="imageUrl" type="text" lblclass="form-label lbl" validationRules={validationRules} placeholder="ImageUrl"/>
          <LabelInput label="Total:" name="totalprice" type="text" lblclass="form-label lbl" validationRules={validationRules} disabled value={`$${total}`}/>
        </form>
      </FormProvider>
    </div>
  );
});

const CharacterArticle = ({ handleChange, hideCheckbox, setHideCheckbox, setExtraCharacter }) => {

  const handleCharacterClick = useCallback((e) => {
    if(!e.currentTarget.checked) setHideCheckbox(true);
    else setHideCheckbox(false);
    handleChange();
  }, [handleChange, setHideCheckbox])

  return (
    <>
      <CheckboxInput label="Extra character" name="extraCharacterCheck" validationRules={validationRules} onClick={handleCharacterClick}/>
      <LabelInput label="Amount of extra characters" name="extraCharacterAmount" type="number" hidden={hideCheckbox} validationRules={validationRules} defaultValue={1} min={1} max={3} onChange={(e) => setExtraCharacter(parseInt(e.currentTarget.value))}/>
    </>
  );
}