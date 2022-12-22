import { useEffect, memo } from "react";
import { useCallback, useMemo } from "react";
import { useState } from "react";
import { Button } from "react-bootstrap";
import { FormProvider, useForm } from "react-hook-form";
import * as articlesApi from "../api/articles";
import { CheckboxInput, LabelInput, TextareaInput } from "../components/FormComponents";
import { useMessage } from "../contexts/DialogProvider";
import { useSession } from "../contexts/AuthProvider";
import dialogs from "../dialogs.json";
import { calculatePrice, getErrorMessage } from "../components/GeneralMethods";

const validationRules = {
  description: {
    required: "Description is required"
  },
  imageUrl: {
    required: "Image URL is required",
    validate: (val) => {
      const isUrl = val.startsWith('http://') || val.startsWith('https://');
      const isImg = val.endsWith(".png") || val.endsWith(".jpeg") || val.endsWith(".jpg");
      if(!isUrl) return "The reference has to be a valid URL";
      if(!isImg) return "The image has to be either of the following file types: png, jpg, jpeg";
    }
  }
}

export default memo(function Article({type}) {
  const [articles, setArticles] = useState([]);
  const article = useMemo(() => articles.find(el => el.type === type || el.name === type), [articles, type]);
  const detailedPrice = useMemo(() => articles.find(el => el.name === 'Background')?.extra, [articles]);
  const { register, handleSubmit, formState: { errors } } = useForm();

  const [description, setDescription] = useState('');
  const [detailed, setDetailed] = useState(false);
  const [extra, setExtra] = useState(false);
  const [extraCharacter, setExtraCharacter] = useState(1);
  const [reference, setReference] = useState('');
  const [total, setTotal] = useState(article?.price);
  const { user } = useSession();

  const [cart, setCart] = useState(JSON.parse(localStorage.getItem('cart')));
  const { setShowMessage, setMessage, setMessageTitle } = useMessage();

  const clearForm = useCallback(() => {
    setDescription('');
    setDetailed(false);
    setExtra(false);
    setExtraCharacter(1);
    setReference('');
    setTotal(article?.price);
  }, [article]);

  const calculate = useCallback(() => {
    const amount = !extra && article?.name !== 'Background' ? 1 : extra ? extraCharacter+1 : 0;
    setTotal(calculatePrice(article, parseInt(detailedPrice), {characters: amount, detailed}));
  }, [article, detailedPrice, extraCharacter, extra, detailed]);

  useEffect(() => {
    const fetchArticles = async () => {
      await articlesApi.getAll().then((data) => {
        setArticles(data);
      }).catch((err) => {
        const error = getErrorMessage(err);
        setMessageTitle('Error');
        setMessage(error.message);
        setShowMessage(true);
      });
    }

    fetchArticles();
  }, [setMessage, setShowMessage, setMessageTitle]);

  useEffect(() => {
    calculate();
  }, [articles, calculate])

  const onSubmit = useCallback(async (data) => {
    delete data["totalprice"];
    delete data["extraCharacterCheck"];
    data["characters"] = !data["characters"] ? 0 : !extra && article.name !== 'Background' ? 1 : parseInt(data["characters"])+1;
    data["type"] = article.type ?? article.name.toLowerCase();

    let cartArray = [];
    if(cart) {
      cartArray = cart;
      const cartItem = cartArray.find(el => el.user === user.id);
      if(cartItem) {
        cartArray.splice(cartArray.indexOf(cartItem), 1);
        cartItem.cart.push(data);
        cartArray.push(cartItem);
      }
      else cartArray.push({user: user.id, cart: [data]});
    }
    else cartArray.push({user: user.id, cart: [data]});

    setCart(cartArray);
    localStorage.setItem("cart", JSON.stringify(cartArray));
    setMessage(dialogs.info.article.added);
    setMessageTitle('Info');
    setShowMessage(true);

    clearForm();
  }, [article, cart, clearForm, setMessage, setShowMessage, user, setMessageTitle, extra]);

  return (
    <div className="article" data-cy="article_page">
      <h1>{article?.name}</h1>
      <h2>Create Order</h2>
      <FormProvider onSubmit={handleSubmit} errors={errors} register={register}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <TextareaInput data-cy="input_description" label="Description" name="description" lblclass="form-label lbl" rows="3" maxLength={300} validationRules={validationRules} value={description} onChange={e => setDescription(e.currentTarget.value)}/>
          <label className="form-label lbl">Attributes:</label>
          <CheckboxInput data-cy="checkbox_detailed" label="Detailed background" name="detailed" validationRules={validationRules} checked={detailed} onClick={(e) => {setDetailed(e.currentTarget.checked); calculate();}}/>
          {type.toLowerCase() !== 'background' && <CharacterArticle handleChange={calculate} extra={extra} setExtra={setExtra} setExtraCharacter={setExtraCharacter} extraCharacter={extraCharacter}/>}
          <LabelInput data-cy="input_image" label="Reference:" name="imageUrl" type="text" lblclass="form-label lbl" validationRules={validationRules} placeholder="https://example.png" value={reference} onChange={e => setReference(e.currentTarget.value)}/>
          <LabelInput data-cy="input_total" label="Total:" name="totalprice" type="text" lblclass="form-label lbl" validationRules={validationRules} disabled value={`$${total}`}/>
          <div className="d-grid justify-content-end"><Button data-cy="button_submit" type="submit">Save</Button></div>
        </form>
      </FormProvider>
    </div>
  );
});

const CharacterArticle = ({ handleChange, extra, setExtra, setExtraCharacter, extraCharacter }) => {
  const handleCharacterClick = useCallback((e) => {
    setExtra(e.currentTarget.checked)
    handleChange();
  }, [handleChange, setExtra]);

  return (
    <>
      <CheckboxInput data-cy="checkbox_character" label="Extra character" name="extraCharacterCheck" validationRules={validationRules} checked={extra} onClick={handleCharacterClick}/>
      <LabelInput data-cy="input_character" label="Amount of extra characters" name="characters" type="number" hidden={!extra} validationRules={validationRules} min={1} max={3} value={extraCharacter} onChange={(e) => setExtraCharacter(parseInt(e.currentTarget.value))}/>
    </>
  );
}