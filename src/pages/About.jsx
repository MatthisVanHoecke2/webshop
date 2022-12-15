import {Link} from 'react-router-dom';

export default function About() {
  return (
    <>
      <div className="col-md-10 textpage">
        <div className="row" style={{padding: "10px"}}>
          <h1>Bio</h1>
        </div>
        <div className="row justify-content-center" style={{padding: "10px"}}>
          <div className="col-md-5 about">
            <p>
              I am a Freelance artist and KRG film student.
              The type of art I make is varies from profile pictures to backgrounds.
              My hobbies are: playing videogames, drawing and watching anime.
            </p>
          </div>
          <div className="col-md-5">
            <img className='img-thumbnail' src={`${process.env.PUBLIC_URL}/resources/images/pfp.jpg`} alt="pfp"/>
          </div>
        </div>
        <div className="row justify-content-center" style={{padding: "10px"}}>
          <div className='col-md-10 justify-content-center about'>
            <div className='form-row'>
              <label><i>Instagram:</i></label><Link to="https://www.instagram.com/deewatter/">https://www.instagram.com/deewatter/</Link>
            </div>
            <div className='form-row'>
              <label><i>Twitter:</i></label><Link to="https://twitter.com/deewatter?lang=en">https://twitter.com/deewatter?lang=en</Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}