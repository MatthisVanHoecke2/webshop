import { memo, useCallback } from "react";
import { Link } from "react-router-dom";

export default function Home() {
  const arr = [
    [
      `${process.env.PUBLIC_URL}/resources/images/Cupids_Bow.png`,
      `${process.env.PUBLIC_URL}/resources/images/EseDqWEW8AEyzXL.png`, 
      `${process.env.PUBLIC_URL}/resources/images/will_wb.png`
    ],
    [
      `${process.env.PUBLIC_URL}/resources/images/villain_deku.png`, 
      `${process.env.PUBLIC_URL}/resources/images/head-shot.jpg`, 
      `${process.env.PUBLIC_URL}/resources/images/half-body.jpg`
    ],
    [
      `${process.env.PUBLIC_URL}/resources/images/background2.png`, 
      `${process.env.PUBLIC_URL}/resources/images/bg2.png`, 
    ]
  ] 
  return (
    <>
      <div className="col-md-10">
      {arr.map((el, index) => (
          <div className="row justify-content-center" key={index} style={{margin: "1rem"}}>
            <ImageRow images={el}></ImageRow>
          </div>
      ))}
      </div>
    </>
  );
}

const ImageRow = memo(function ImageRow({images}) {
  const handleClick = useCallback((href) => {
    window.open(href, "_blank");
  }, []);

  return (
    <>
      {images.map((el, index) => (
          <div className="col-md" key={"image-"+index}>
            <Link onClick={() => handleClick(el)}><img className="img-thumbnail" src={el} alt={"image-"+index}/></Link>
          </div>
      ))}
    </>
  );
});