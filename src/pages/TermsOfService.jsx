export default function TermsOfService() {
  return (
    <>
    <div className="col-md-10 textpage">
      <div className="row justify-content-center" style={{marginTop: "10px"}}>
        <div className="col-md-8 about">
          <h1>Terms Of Service</h1>
          <ul>
            <li>I have the right to refuse service if it includes anything I'm uncomfortable with</li>
            <li>I won't do business with anyone younger than 13</li>
            <li>Payment will be done before I start working, and only through PayPal</li>
            <li>The artwork the client receives will not be switching ownership, so if they want to post it or use it anywhere they need to:
              <ul className="numbers" style={{listStyleType: "decimal"}}>
                <li>State that the artwork is mine, and done by me</li>
                <li>Provide my contact information (even if it's just my tag) </li>
                <li>Make sure that my signature/ watermark is visible on the drawing</li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </div>
    </>
  );
}